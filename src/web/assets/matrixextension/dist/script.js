// ==========================================================================

// Matrix Extension for Craft CMS
// Author: iamtompickering

// ==========================================================================

if (typeof Craft.MatrixExtension === typeof undefined) {
    Craft.MatrixExtension = {};
}

(function($) {

Craft.MatrixExtension.Init = Garnish.Base.extend({
    extensionMenus: [],

    init: function(options) {
        
        Garnish.requestAnimationFrame($.proxy(function() {
            var $matrixFields = Garnish.$doc.find('.matrix-field');

            for (var i = 0; i < $matrixFields.length; i++) {
                var $matrixField = $($matrixFields[i]);
                var $matrixBlocks = $matrixField.find('> .blocks > .matrixblock');

                for (var j = 0; j < $matrixBlocks.length; j++) {
                    var $matrixBlock = $($matrixBlocks[j]);
                    var $settingsBtn = $matrixBlock.find('.actions .settings.menubtn');

                    // Don't do this for static blocks
                    if ($matrixBlock.hasClass('static')) {
                        continue;
                    }

                    // Create a new class for this specific Matrix field and block
                    this.extensionMenus.push(new Craft.MatrixExtension.Menu($matrixField, $matrixBlock, $matrixBlocks));
                }
            }

            // Create a callback for new blocks
            Garnish.on(Craft.MatrixInput, 'blockAdded', $.proxy(this, 'blockAdded'));

        }, this));

    },

    blockAdded: function(e) {

        Garnish.requestAnimationFrame($.proxy(function() {
            var $matrixField = e.target.$container;
            var $matrixBlocks = $matrixField.find('> .blocks > .matrixblock');
            var $matrixBlock = $(e.$block);

            var blockInstance = $matrixBlock.data('block');

            // Try again if the menu button isn't initialised yet
            if (!blockInstance) {
                this.blockAdded(e);
                return;
            }

            // Update all MatrixExtension menus' with the correct matrix blocks
            $.each(this.extensionMenus, function(index, menu) {
                menu.$matrixBlocks = $matrixBlocks;
            });

            // Don't do this for static blocks
            if ($matrixBlock.hasClass('static')) {
                return;
            }

            // Create a new MatrixExtension menu class for the new block
            this.extensionMenus.push(new Craft.MatrixExtension.Menu($matrixField, $matrixBlock, $matrixBlocks));
        }, this));

    }

});

Craft.MatrixExtension.Menu = Garnish.Base.extend({
   
    init: function($matrixField, $matrixBlock, $matrixBlocks) {

        this.$matrixField = $matrixField;
        this.$matrixBlock = $matrixBlock;
        this.$matrixBlocks = $matrixBlocks;

        const id = this.$matrixBlock[0].dataset.id;

        this.blockInstance = this.$matrixBlock.data('block');

        // Keep track of the delete option - we want to insert before that
        var $deleteOption = this.blockInstance.$actionMenu.find('a[data-action="delete"]').parents('li');

        // Create our buttons
        this.$idBtn = $('<a data-icon="clipboard" data-action="clipboard">' + Craft.t('app', `Copy Block ID: #${id}` ) + '</a>');

        // Add new menu items to the DOM
        this.$idBtn.insertBefore($deleteOption).wrap('<li/>');
        $('<hr class="padded">').insertBefore($deleteOption);

        this.addListener(this.$idBtn, 'click', this.handleClick);

    },

    handleClick: function(e) {

        var $option = $(e.target);

        if ($option.hasClass('disabled') || $option.hasClass('sel')) {
            return;
        }

        if ($option.data('action') == 'clipboard') {
            this.copyToClipboard(e);
        }

        this.blockInstance.actionDisclosure.hide();

    },

    copyToClipboard: function(e) {

        const id = this.$matrixBlock[0].dataset.id;
        const message = `Copied to clipboard: #${id}`;

        const $temp = $("<input>");
        $("body").append($temp);
        $temp.val(id).select();
        document.execCommand("copy");
        $temp.remove();

        Craft.cp.displayNotice(Craft.t('app', message));

    },

});



})(jQuery);