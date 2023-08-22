<?php

namespace Insitaction\EasyCropBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder('exemple_bundle');
        $treeBuilder->getRootNode() /* @phpstan-ignore-line */
            ->children()
                ->scalarNode('param_exemple')
                    ->defaultValue('0')
                    ->info('A config param exemple.')
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}
