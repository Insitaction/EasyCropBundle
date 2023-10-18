<?php

namespace Insitaction\EasyCropBundle\Form\Type;

use EasyCorp\Bundle\EasyAdminBundle\Form\Type\FileUploadType;
use EasyCorp\Bundle\EasyAdminBundle\Form\Type\Model\FileUploadState;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\OptionsResolver\OptionsResolver;

final class CropType extends FileUploadType
{
    public const OPTION_FORCE_SIZE_VALIDATION = 'force_size_validation';
    public const OPTION_FORMAT = 'format'; // Can be either JPEG, PNG or WEBP.
    public const OPTION_HEIGHT = 'height';
    public const OPTION_RESIZE = 'resize';
    public const OPTION_WIDTH = 'width';

    public function __construct(string $projectDir)
    {
        parent::__construct($projectDir);
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $height = $options[self::OPTION_HEIGHT];
        $width = $options[self::OPTION_WIDTH];
        $forceSize = $options[self::OPTION_FORCE_SIZE_VALIDATION];
        $format = $options[self::OPTION_FORMAT];
        $enableResize = $options[self::OPTION_RESIZE];

        unset($options[self::OPTION_HEIGHT], $options[self::OPTION_WIDTH], $options[self::OPTION_FORCE_SIZE_VALIDATION],
            $options[self::OPTION_FORMAT], $options[self::OPTION_RESIZE]);

        parent::buildForm($builder, $options);
        // $builder->remove('file');
        // $builder->add('file', DropzoneType::class, $options);
        $builder->add('cropped', TextType::class, [
            'required' => $options['required'],
            'attr' => [
                self::OPTION_HEIGHT => $height,
                self::OPTION_WIDTH => $width,
                self::OPTION_FORCE_SIZE_VALIDATION => $forceSize,
                self::OPTION_FORMAT => $format,
                self::OPTION_RESIZE => $enableResize,
            ],
        ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        parent::configureOptions($resolver);
        $resolver->setDefault(self::OPTION_HEIGHT, 1);
        $resolver->setDefault(self::OPTION_WIDTH, 1);
        $resolver->setDefault(self::OPTION_FORMAT, 'WEBP');
        $resolver->setDefault(self::OPTION_FORCE_SIZE_VALIDATION, false);
        $resolver->setDefault(self::OPTION_RESIZE, false);
    }

    public function getBlockPrefix(): string
    {
        return 'ea_filecropupload';
    }

    /**
     * @param UploadedFile|mixed|null $currentFiles
     */
    public function mapFormsToData($forms, &$currentFiles): void
    {
        /** @var FormInterface[] $children */
        $children = iterator_to_array($forms);
        /** @var UploadedFile|null $uploadedFile */
        $uploadedFile = $children['file']->getData();
        $uploadedFiles = $children['cropped']->getData();

        if ($uploadedFile instanceof UploadedFile && UPLOAD_ERR_OK !== $uploadedFile->getError()) {
            return;
        }

        if (is_string($uploadedFiles) && str_contains($uploadedFiles, 'base64,')) {
            [, $data] = explode('base64,', $uploadedFiles);
            $data = base64_decode($data, true);

            file_put_contents($uploadedFile->getPathname(), $data);

            $uploadedFiles = new UploadedFile(
                $uploadedFile->getPathname(),
                $uploadedFile->getClientOriginalName(),
                $uploadedFile->getMimeType(),
            );
        }

        /** @var FileUploadState|null $state */
        $state = $children['cropped']->getParent()?->getConfig()->getAttribute('state');

        if (null === $state) {
            return;
        }

        $state->setCurrentFiles($currentFiles);
        $state->setUploadedFiles($uploadedFiles);
        $state->setDelete((bool)$children['delete']->getData());

        if (!$state->isModified()) {
            return;
        }

        $currentFiles = $uploadedFiles;
    }
}
