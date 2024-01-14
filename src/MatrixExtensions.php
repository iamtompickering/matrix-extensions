<?php

namespace tompickering\craftmatrixextensions;

use Craft;
use craft\base\Plugin;

/**
 * Matrix Extensions plugin
 *
 * @method static MatrixExtensions getInstance()
 * @author Tom Pickering <iamtompickering@gmail.com>
 * @copyright Tom Pickering
 * @license https://craftcms.github.io/license/ Craft License
 */
class MatrixExtensions extends Plugin
{
    public string $schemaVersion = '1.0.0';

    public static function config(): array
    {
        return [
            'components' => [
                // Define component configs here...
            ],
        ];
    }

    public function init(): void
    {
        parent::init();

        // Defer most setup tasks until Craft is fully initialized
        Craft::$app->onInit(function() {
            $this->attachEventHandlers();
            // ...
        });
    }

    private function attachEventHandlers(): void
    {
        // Register event handlers here ...
        // (see https://craftcms.com/docs/4.x/extend/events.html to get started)
    }
}
