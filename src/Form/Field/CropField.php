<?php

namespace Insitaction\EasyCropBundle\Form\Field;

use Closure;
use EasyCorp\Bundle\EasyAdminBundle\Config\Asset;
use EasyCorp\Bundle\EasyAdminBundle\Config\Option\TextAlign;
use EasyCorp\Bundle\EasyAdminBundle\Contracts\Field\FieldInterface;
use EasyCorp\Bundle\EasyAdminBundle\Field\FieldTrait;
use Exception;
use Insitaction\EasyCropBundle\Form\Type\CropType;
use Symfony\Contracts\Translation\TranslatableInterface;

final class CropField implements FieldInterface
{
    use FieldTrait;

    public const OPTION_BASE_PATH = 'basePath';
    public const OPTION_UPLOAD_DIR = 'uploadDir';
    public const OPTION_UPLOADED_FILE_NAME_PATTERN = 'uploadedFileNamePattern';

    /**
     * @param TranslatableInterface|string|false|null $label
     */
    public static function new(string $propertyName, $label = null): self
    {
        return (new self())
            ->setProperty($propertyName)
            ->setLabel($label)
            ->setTemplateName('crud/field/image')
            ->setFormType(CropType::class)
            ->addCssClass('field-image')
            ->addJsFiles(Asset::fromEasyAdminAssetPackage('field-image.js'), Asset::fromEasyAdminAssetPackage('field-file-upload.js'))
            ->setDefaultColumns('col-md-7 col-xxl-5')
            ->setTextAlign(TextAlign::CENTER)
            ->setCustomOption(self::OPTION_BASE_PATH, null)
            ->setCustomOption(self::OPTION_UPLOAD_DIR, null)
            ->setCustomOption(self::OPTION_UPLOADED_FILE_NAME_PATTERN, '[name].[extension]')
        ;
    }

    public function enableResize(bool $force): self
    {
        $this->setFormTypeOption(CropType::OPTION_RESIZE, $force);

        return $this;
    }

    public function enableSizeValidation(bool $force): self
    {
        $this->setFormTypeOption(CropType::OPTION_FORCE_SIZE_VALIDATION, $force);

        return $this;
    }

    public function setBasePath(string $path): self
    {
        $this->setCustomOption(self::OPTION_BASE_PATH, $path);

        return $this;
    }

    public function setFormat(string $format): self
    {
        if (!in_array($format, ['PNG', 'JPEG', 'WEBP'], true)) {
            throw new Exception('Only \'PNG\', \'JPEG\', \'WEBP\' are supported formats.');
        }

        $this->setFormTypeOption(CropType::OPTION_FORMAT, $format);

        return $this;
    }

    /** @phpstan-ignore-next-line */
    public function setFormTypeOption(string $optionName, $optionValue): self
    {
        if ('multiple' === $optionName) {
            throw new Exception('The multiple option is currently not supported by CropField.');
        }

        $this->dto->setFormTypeOption($optionName, $optionValue);

        return $this;
    }

    /** @phpstan-ignore-next-line */
    public function setFormTypeOptions(array $options): self
    {
        if (array_key_exists('multiple', $options)) {
            throw new Exception('The multiple option is currently not supported by CropField.');
        }

        $this->dto->setFormTypeOptions($options);

        return $this;
    }

    public function setHeight(int $height): self
    {
        $this->setFormTypeOption(CropType::OPTION_HEIGHT, $height);

        return $this;
    }

    /**
     * Relative to project's root directory (e.g. use 'public/uploads/' for `<your-project-dir>/public/uploads/`)
     * Default upload dir: `<your-project-dir>/public/uploads/images/`.
     */
    public function setUploadDir(string $uploadDirPath): self
    {
        $this->setCustomOption(self::OPTION_UPLOAD_DIR, $uploadDirPath);

        return $this;
    }

    /**
     * @param Closure|string $patternOrCallable
     *
     * If it's a string, uploaded files will be renamed according to the given pattern.
     * The pattern can include the following special values:
     *   [day] [month] [year] [timestamp]
     *   [name] [slug] [extension] [contenthash]
     *   [randomhash] [uuid] [ulid]
     * (e.g. [year]/[month]/[day]/[slug]-[contenthash].[extension])
     *
     * If it's a callable, you will be passed the Symfony's UploadedFile instance and you must
     * return a string with the new filename.
     * (e.g. fn(UploadedFile $file) => sprintf('upload_%d_%s.%s', random_int(1, 999), $file->getFilename(), $file->guessExtension()))
     */
    public function setUploadedFileNamePattern(Closure|string $patternOrCallable): self
    {
        $this->setCustomOption(self::OPTION_UPLOADED_FILE_NAME_PATTERN, $patternOrCallable);

        return $this;
    }

    public function setWidth(int $width): self
    {
        $this->setFormTypeOption(CropType::OPTION_WIDTH, $width);

        return $this;
    }
}
