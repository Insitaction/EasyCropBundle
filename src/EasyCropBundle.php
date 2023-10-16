<?php

namespace Insitaction\EasyCropBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class EasyCropBundle extends Bundle {
    public function getPath(): string
    {
        return \dirname(__DIR__);
    }
}
