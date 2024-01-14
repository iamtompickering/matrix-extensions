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

                    // Collapse all matrix blocks
                    $matrixBlock.addClass('init-collapsed');
                    this.collapseBlocks();

                    // Create a new class for this specific Matrix field and block
                    this.extensionMenus.push(new Craft.MatrixExtension.Menu($matrixField, $matrixBlock, $matrixBlocks));
                }
            }

            // Create a callback for new blocks
            Garnish.on(Craft.MatrixInput, 'blockAdded', $.proxy(this, 'blockAdded'));

        }, this));

    },

    collapseBlocks: function() {
              
        $('.matrixblock').each(function() {

            var $matrixblock = $(this),
                $actionMenu = $matrixblock.data('block').$actionMenu,
                $collapseLink = $('a[data-action="collapse"]', $actionMenu);

            $collapseLink.click();
            $matrixblock.removeClass('init-collapsed');
            
        });
    

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
        this.$copyIdBtn = $('<a data-icon="clipboard" data-action="copy-id">' + Craft.t('app', `Copy Block ID: #${id}` ) + '</a>');
        this.$collapseAllBtn = $('<a data-icon="collapse" data-action="collapse-all">' + Craft.t('app', 'Collapse All Blocks' ) + '</a>');
        this.$expandAllBtn = $('<a data-icon="expand" data-action="expand-all">' + Craft.t('app', 'Expand All Blocks' ) + '</a>');

        // Add new menu items to the DOM        
        this.$collapseAllBtn.insertBefore($deleteOption).wrap('<li/>');
        this.$expandAllBtn.insertBefore($deleteOption).wrap('<li/>');
        $('<hr class="padded">').insertBefore($deleteOption);
        this.$copyIdBtn.insertBefore($deleteOption).wrap('<li/>');
        $('<hr class="padded">').insertBefore($deleteOption);

        this.addListener(this.$copyIdBtn, 'click', this.handleClick);
        this.addListener(this.$collapseAllBtn, 'click', this.handleClick);
        this.addListener(this.$expandAllBtn, 'click', this.handleClick);

    },

    handleClick: function(e) {

        var $option = $(e.target);

        if ($option.hasClass('disabled') || $option.hasClass('sel')) {
            return;
        }

        if ($option.data('action') == 'copy-id') {
            this.copyToClipboard(e);
        }

        if ($option.data('action') == 'collapse-all') {
            this.collapseAll(e);
        }

        if ($option.data('action') == 'expand-all') {
            this.expandAll(e);
        }

        this.blockInstance.actionDisclosure.hide();

    },

    collapseAll: function(e) {

        $('.matrixblock').each(function() {

            var $matrixBlock = $(this),
                $actionMenu = $matrixBlock.data('block').$actionMenu,
                $collapseLink = $('a[data-action="collapse"]', $actionMenu);

            $collapseLink.click();
            $matrixBlock.addClass('collapsed');

            
        });

    },

    expandAll: function(e) {

        $('.matrixblock').each(function() {

            var $matrixBlock = $(this),
                $actionMenu = $matrixBlock.data('block').$actionMenu,
                $expandLink = $('a[data-action="expand"]', $actionMenu);

            $expandLink.click();
            $matrixBlock.removeClass('collapsed');
            
        });

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