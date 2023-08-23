<?php

namespace Insitaction\EasyCropBundle\Form\Field\Configurator;

use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Context\AdminContext;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldConfiguratorInterface;
use EasyCorp\Bundle\EasyAdminBundle\Dto\AssetDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\EntityDto;
use EasyCorp\Bundle\EasyAdminBundle\Dto\FieldDto;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use Insitaction\EasyCropBundle\Form\Field\CropField;
use InvalidArgumentException;
use Symfony\Component\Asset\Package;
use Symfony\Component\Asset\VersionStrategy\JsonManifestVersionStrategy;
use Symfony\Component\HttpFoundation\File\UploadedFile;

use function Symfony\Component\String\u;

final class CropConfigurator implements FieldConfiguratorInterface
{
    private string $projectDir;

    public function __construct(string $projectDir)
    {
        $this->projectDir = $projectDir;
    }

    public function configure(FieldDto $field, EntityDto $entityDto, AdminContext $context): void
    {
        $package = new Package(new JsonManifestVersionStrategy($this->projectDir.'/public/bundles/easycrop/manifest.json'));
        $field->addJsAsset(new AssetDto($package->getUrl('easycropbundle.js')));
        $field->addCssAsset(new AssetDto($package->getUrl('easycropbundle.css')));

        $configuredBasePath = $field->getCustomOption(ImageField::OPTION_BASE_PATH);

        $formattedValue = \is_array($field->getValue())
            ? $this->getImagesPaths($field->getValue(), $configuredBasePath)
            : $this->getImagePath($field->getValue(), $configuredBasePath);
        $field->setFormattedValue($formattedValue);

        $field->setFormTypeOption('upload_filename', $field->getCustomOption(ImageField::OPTION_UPLOADED_FILE_NAME_PATTERN));

        // this check is needed to avoid displaying broken images when image properties are optional
        if (null === $formattedValue || '' === $formattedValue || (\is_array($formattedValue) && 0 === \count($formattedValue)) || $formattedValue === rtrim($configuredBasePath ?? '', '/')) {
            $field->setTemplateName('label/empty');
        }

        if (!\in_array($context->getCrud()->getCurrentPage(), [Crud::PAGE_EDIT, Crud::PAGE_NEW], true)) {
            return;
        }

        $relativeUploadDir = $field->getCustomOption(ImageField::OPTION_UPLOAD_DIR);
        if (null === $relativeUploadDir) {
            throw new InvalidArgumentException(sprintf('The "%s" image field must define the directory where the images are uploaded using the setUploadDir() method.', $field->getProperty()));
        }
        $relativeUploadDir = u($relativeUploadDir)->trimStart(\DIRECTORY_SEPARATOR)->ensureEnd(\DIRECTORY_SEPARATOR)->toString();
        $isStreamWrapper = filter_var($relativeUploadDir, \FILTER_VALIDATE_URL);
        if (false !== $isStreamWrapper) {
            $absoluteUploadDir = $relativeUploadDir;
        } else {
            $absoluteUploadDir = u($relativeUploadDir)->ensureStart($this->projectDir . \DIRECTORY_SEPARATOR)->toString();
        }
        $field->setFormTypeOption('upload_dir', $absoluteUploadDir);
    }

    public function supports(FieldDto $field, EntityDto $entityDto): bool
    {
        return CropField::class === $field->getFieldFqcn();
    }

    private function getImagePath(?string $imagePath, ?string $basePath): ?string
    {
        // add the base path only to images that are not absolute URLs (http or https) or protocol-relative URLs (//)
        if (null === $imagePath || 0 !== preg_match('/^(http[s]?|\/\/)/i', $imagePath)) {
            return $imagePath;
        }

        // remove project path from filepath
        $imagePath = str_replace($this->projectDir . \DIRECTORY_SEPARATOR . 'public' . \DIRECTORY_SEPARATOR, '', $imagePath);

        return isset($basePath)
            ? rtrim($basePath, '/') . '/' . ltrim($imagePath, '/')
            : '/' . ltrim($imagePath, '/');
    }

    /**
     * @param array<int, UploadedFile>|null $images
     *
     * @return list<string>
     */
    private function getImagesPaths(?array $images, ?string $basePath): array
    {
        $imagesPaths = [];
        foreach ($images as $image) {
            $imagesPaths[] = $this->getImagePath($image, $basePath);
        }

        return $imagesPaths;
    }
}
