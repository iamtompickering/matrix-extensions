<?php

namespace tompickering\craftmatrixextensions\web\assets\matrixextension;

use Craft;
use craft\web\AssetBundle;

use craft\web\assets\matrix\MatrixAsset;

/**
 * Matrix Extension asset bundle
 */
class MatrixExtension extends AssetBundle
{

    public $sourcePath = __DIR__ . '/dist';

    public $depends = [
        MatrixAsset::class,
    ];

    public $js = [
        'script.js',
    ];

}
