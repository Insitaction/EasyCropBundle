<?php

namespace Insitaction\EasyCropBundle\Form\Type;

use EasyCorp\Bundle\EasyAdminBundle\Form\Type\FileUploadType;
use EasyCorp\Bundle\EasyAdminBundle\Form\Type\Model\FileUploadState;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

final class CropType extends FileUploadType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        parent::buildForm($builder, $options);
        // $builder->remove('file');
        // $builder->add('file', DropzoneType::class, $options);
        $builder->add('cropped', TextType::class, ['required' => $options['required']]);
    }

    public function getBlockPrefix(): string
    {
        return 'ea_filecropupload';
    }

    public function mapFormsToData($forms, &$currentFiles): void
    {
        /** @var FormInterface[] $children */
        $children = iterator_to_array($forms);
        /** @var UploadedFile $uploadedFile */
        $uploadedFile = $children['file']->getData();
        $uploadedFiles = $children['cropped']->getData();

        if (null !== $uploadedFiles && str_contains($uploadedFiles, 'base64,')) {
            [, $data] = explode('base64,', $uploadedFiles);
            $data = base64_decode($data, true);

            file_put_contents($uploadedFile->getPathname(), $data);

            $uploadedFiles = new UploadedFile(
                $uploadedFile->getPathname(),
                $uploadedFile->getClientOriginalName(),
                $uploadedFile->getMimeType(),
            );
        }

        /** @var FileUploadState $state */
        $state = $children['cropped']->getParent()->getConfig()->getAttribute('state');
        $state->setCurrentFiles($currentFiles);
        $state->setUploadedFiles($uploadedFiles);
        $state->setDelete($children['delete']->getData());

        if (!$state->isModified()) {
            return;
        }

        if ($state->isAddAllowed() && !$state->isDelete()) {
            $currentFiles = array_merge($currentFiles, $uploadedFiles);
        } else {
            $currentFiles = $uploadedFiles;
        }
    }
}
