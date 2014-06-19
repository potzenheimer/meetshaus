/*!
* Meetshaus v1.0.0 by meetshaus
* Copyright Meetshaus
* Licensed under [object Object].
*
* Designed and built by ade25
*/
/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof define == 'undefined' && typeof exports == 'undefined' && typeof jQuery == 'undefined') { throw new Error('Bootstrap\'s JavaScript requires jQuery') }

/* ========================================================================
 * Bootstrap: transition.js v3.1.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
      var el = document.createElement('bootstrap')

      var transEndEventNames = {
        WebkitTransition : 'webkitTransitionEnd',
        MozTransition    : 'transitionend',
        OTransition      : 'oTransitionEnd otransitionend',
        transition       : 'transitionend'
      }

      for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
          return { end: transEndEventNames[name] }
        }
      }

      return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
      var called = false
      var $el = this
      $(this).one('bsTransitionEnd', function () { called = true })
      var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
      setTimeout(callback, duration)
      return this
    }

    $(function () {
      $.support.transition = transitionEnd()

      if (!$.support.transition) return

      $.event.special.bsTransitionEnd = {
        bindType: $.support.transition.end,
        delegateType: $.support.transition.end,
        handle: function (e) {
          if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
        }
      }
    })

  })

}();

/* ========================================================================
 * Bootstrap: alert.js v3.1.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // ALERT CLASS DEFINITION
    // ======================

    var dismiss = '[data-dismiss="alert"]'
    var Alert   = function (el) {
      $(el).on('click', dismiss, this.close)
    }

    Alert.VERSION = '3.1.1'

    Alert.prototype.close = function (e) {
      var $this    = $(this)
      var selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
      }

      var $parent = $(selector)

      if (e) e.preventDefault()

      if (!$parent.length) {
        $parent = $this.hasClass('alert') ? $this : $this.parent()
      }

      $parent.trigger(e = $.Event('close.bs.alert'))

      if (e.isDefaultPrevented()) return

      $parent.removeClass('in')

      function removeElement() {
        // detach from parent, fire event then clean up data
        $parent.detach().trigger('closed.bs.alert').remove()
      }

      $.support.transition && $parent.hasClass('fade') ?
        $parent
          .one('bsTransitionEnd', removeElement)
          .emulateTransitionEnd(150) :
        removeElement()
    }


    // ALERT PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
      return this.each(function () {
        var $this = $(this)
        var data  = $this.data('bs.alert')

        if (!data) $this.data('bs.alert', (data = new Alert(this)))
        if (typeof option == 'string') data[option].call($this)
      })
    }

    var old = $.fn.alert

    $.fn.alert             = Plugin
    $.fn.alert.Constructor = Alert


    // ALERT NO CONFLICT
    // =================

    $.fn.alert.noConflict = function () {
      $.fn.alert = old
      return this
    }


    // ALERT DATA-API
    // ==============

    $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

  })

}();

/* ========================================================================
 * Bootstrap: button.js v3.1.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================

    var Button = function (element, options) {
      this.$element  = $(element)
      this.options   = $.extend({}, Button.DEFAULTS, options)
      this.isLoading = false
    }

    Button.VERSION  = '3.1.1'

    Button.DEFAULTS = {
      loadingText: 'loading...'
    }

    Button.prototype.setState = function (state) {
      var d    = 'disabled'
      var $el  = this.$element
      var val  = $el.is('input') ? 'val' : 'html'
      var data = $el.data()

      state = state + 'Text'

      if (data.resetText == null) $el.data('resetText', $el[val]())

      $el[val](data[state] == null ? this.options[state] : data[state])

      // push to event loop to allow forms to submit
      setTimeout($.proxy(function () {
        if (state == 'loadingText') {
          this.isLoading = true
          $el.addClass(d).attr(d, d)
        } else if (this.isLoading) {
          this.isLoading = false
          $el.removeClass(d).removeAttr(d)
        }
      }, this), 0)
    }

    Button.prototype.toggle = function () {
      var changed = true
      var $parent = this.$element.closest('[data-toggle="buttons"]')

      if ($parent.length) {
        var $input = this.$element.find('input')
        if ($input.prop('type') == 'radio') {
          if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
          else $parent.find('.active').removeClass('active')
        }
        if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
      }

      if (changed) this.$element.toggleClass('active')
    }


    // BUTTON PLUGIN DEFINITION
    // ========================

    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.button')
        var options = typeof option == 'object' && option

        if (!data) $this.data('bs.button', (data = new Button(this, options)))

        if (option == 'toggle') data.toggle()
        else if (option) data.setState(option)
      })
    }

    var old = $.fn.button

    $.fn.button             = Plugin
    $.fn.button.Constructor = Button


    // BUTTON NO CONFLICT
    // ==================

    $.fn.button.noConflict = function () {
      $.fn.button = old
      return this
    }


    // BUTTON DATA-API
    // ===============

    $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })

  })

}();

/* ========================================================================
 * Bootstrap: carousel.js v3.1.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // CAROUSEL CLASS DEFINITION
    // =========================

    var Carousel = function (element, options) {
      this.$element    = $(element).on('keydown.bs.carousel', $.proxy(this.keydown, this))
      this.$indicators = this.$element.find('.carousel-indicators')
      this.options     = options
      this.paused      =
      this.sliding     =
      this.interval    =
      this.$active     =
      this.$items      = null

      this.options.pause == 'hover' && this.$element
        .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
        .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
    }

    Carousel.VERSION  = '3.1.1'

    Carousel.DEFAULTS = {
      interval: 5000,
      pause: 'hover',
      wrap: true
    }

    Carousel.prototype.keydown = function (e) {
      switch (e.which) {
        case 37: this.prev(); break
        case 39: this.next(); break
        default: return
      }

      e.preventDefault()
    }

    Carousel.prototype.cycle = function (e) {
      e || (this.paused = false)

      this.interval && clearInterval(this.interval)

      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

      return this
    }

    Carousel.prototype.getItemIndex = function (item) {
      this.$items = item.parent().children('.item')
      return this.$items.index(item || this.$active)
    }

    Carousel.prototype.to = function (pos) {
      var that        = this
      var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
      if (activeIndex == pos) return this.pause().cycle()

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

    Carousel.prototype.pause = function (e) {
      e || (this.paused = true)

      if (this.$element.find('.next, .prev').length && $.support.transition) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }

      this.interval = clearInterval(this.interval)

      return this
    }

    Carousel.prototype.next = function () {
      if (this.sliding) return
      return this.slide('next')
    }

    Carousel.prototype.prev = function () {
      if (this.sliding) return
      return this.slide('prev')
    }

    Carousel.prototype.slide = function (type, next) {
      var $active   = this.$element.find('.item.active')
      var $next     = next || $active[type]()
      var isCycling = this.interval
      var direction = type == 'next' ? 'left' : 'right'
      var fallback  = type == 'next' ? 'first' : 'last'
      var that      = this

      if (!$next.length) {
        if (!this.options.wrap) return
        $next = this.$element.find('.item')[fallback]()
      }

      if ($next.hasClass('active')) return (this.sliding = false)

      var relatedTarget = $next[0]
      var slideEvent = $.Event('slide.bs.carousel', {
        relatedTarget: relatedTarget,
        direction: direction
      })
      this.$element.trigger(slideEvent)
      if (slideEvent.isDefaultPrevented()) return

      this.sliding = true

      isCycling && this.pause()

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
        $nextIndicator && $nextIndicator.addClass('active')
      }

      var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
      if ($.support.transition && this.$element.hasClass('slide')) {
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        $active
          .one('bsTransitionEnd', function () {
            $next.removeClass([type, direction].join(' ')).addClass('active')
            $active.removeClass(['active', direction].join(' '))
            that.sliding = false
            setTimeout(function () {
              that.$element.trigger(slidEvent)
            }, 0)
          })
          .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
      } else {
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger(slidEvent)
      }

      isCycling && this.cycle()

      return this
    }


    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.carousel')
        var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
        var action  = typeof option == 'string' ? option : options.slide

        if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
        if (typeof option == 'number') data.to(option)
        else if (action) data[action]()
        else if (options.interval) data.pause().cycle()
      })
    }

    var old = $.fn.carousel

    $.fn.carousel             = Plugin
    $.fn.carousel.Constructor = Carousel


    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.carousel.noConflict = function () {
      $.fn.carousel = old
      return this
    }


    // CAROUSEL DATA-API
    // =================

    $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
      var href
      var $this   = $(this)
      var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      var options = $.extend({}, $target.data(), $this.data())
      var slideIndex = $this.attr('data-slide-to')
      if (slideIndex) options.interval = false

      Plugin.call($target, options)

      if (slideIndex) {
        $target.data('bs.carousel').to(slideIndex)
      }

      e.preventDefault()
    })

    $(window).on('load', function () {
      $('[data-ride="carousel"]').each(function () {
        var $carousel = $(this)
        Plugin.call($carousel, $carousel.data())
      })
    })

  })

}();

/* ========================================================================
 * Bootstrap: collapse.js v3.1.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function (element, options) {
      this.$element      = $(element)
      this.options       = $.extend({}, Collapse.DEFAULTS, options)
      this.transitioning = null

      if (this.options.parent) this.$parent = $(this.options.parent)
      if (this.options.toggle) this.toggle()
    }

    Collapse.VERSION  = '3.1.1'

    Collapse.DEFAULTS = {
      toggle: true
    }

    Collapse.prototype.dimension = function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function () {
      if (this.transitioning || this.$element.hasClass('in')) return

      var startEvent = $.Event('show.bs.collapse')
      this.$element.trigger(startEvent)
      if (startEvent.isDefaultPrevented()) return

      var actives = this.$parent && this.$parent.find('> .panel > .in')

      if (actives && actives.length) {
        var hasData = actives.data('bs.collapse')
        if (hasData && hasData.transitioning) return
        Plugin.call(actives, 'hide')
        hasData || actives.data('bs.collapse', null)
      }

      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        .addClass('collapsing')[dimension](0)

      this.transitioning = 1

      var complete = function () {
        this.$element
          .removeClass('collapsing')
          .addClass('collapse in')[dimension]('')
        this.transitioning = 0
        this.$element
          .trigger('shown.bs.collapse')
      }

      if (!$.support.transition) return complete.call(this)

      var scrollSize = $.camelCase(['scroll', dimension].join('-'))

      this.$element
        .one('bsTransitionEnd', $.proxy(complete, this))
        .emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])
    }

    Collapse.prototype.hide = function () {
      if (this.transitioning || !this.$element.hasClass('in')) return

      var startEvent = $.Event('hide.bs.collapse')
      this.$element.trigger(startEvent)
      if (startEvent.isDefaultPrevented()) return

      var dimension = this.dimension()

      this.$element[dimension](this.$element[dimension]())[0].offsetHeight

      this.$element
        .addClass('collapsing')
        .removeClass('collapse')
        .removeClass('in')

      this.transitioning = 1

      var complete = function () {
        this.transitioning = 0
        this.$element
          .trigger('hidden.bs.collapse')
          .removeClass('collapsing')
          .addClass('collapse')
      }

      if (!$.support.transition) return complete.call(this)

      this.$element
        [dimension](0)
        .one('bsTransitionEnd', $.proxy(complete, this))
        .emulateTransitionEnd(350)
    }

    Collapse.prototype.toggle = function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.collapse')
        var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

        if (!data && options.toggle && option == 'show') option = !option
        if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }

    var old = $.fn.collapse

    $.fn.collapse             = Plugin
    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function () {
      $.fn.collapse = old
      return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
      var href
      var $this   = $(this)
      var target  = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      var $target = $(target)
      var data    = $target.data('bs.collapse')
      var option  = data ? 'toggle' : $this.data()
      var parent  = $this.attr('data-parent')
      var $parent = parent && $(parent)

      if (!data || !data.transitioning) {
        if ($parent) $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
        $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
      }

      Plugin.call($target, option)
    })

  })

}();

/* ========================================================================
 * Bootstrap: dropdown.js v3.1.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop'
    var toggle   = '[data-toggle="dropdown"]'
    var Dropdown = function (element) {
      $(element).on('click.bs.dropdown', this.toggle)
    }

    Dropdown.VERSION = '3.1.1'

    Dropdown.prototype.toggle = function (e) {
      var $this = $(this)

      if ($this.is('.disabled, :disabled')) return

      var $parent  = getParent($this)
      var isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
          // if mobile we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
        }

        var relatedTarget = { relatedTarget: this }
        $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

        if (e.isDefaultPrevented()) return

        $this.trigger('focus')

        $parent
          .toggleClass('open')
          .trigger('shown.bs.dropdown', relatedTarget)
      }

      return false
    }

    Dropdown.prototype.keydown = function (e) {
      if (!/(38|40|27)/.test(e.keyCode)) return

      var $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      var $parent  = getParent($this)
      var isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).trigger('focus')
        return $this.trigger('click')
      }

      var desc = ' li:not(.divider):visible a'
      var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

      if (!$items.length) return

      var index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0)                 index--                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index)                                      index = 0

      $items.eq(index).trigger('focus')
    }

    function clearMenus(e) {
      if (e && e.which === 3) return
      $(backdrop).remove()
      $(toggle).each(function () {
        var $parent = getParent($(this))
        var relatedTarget = { relatedTarget: this }
        if (!$parent.hasClass('open')) return
        $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
        if (e.isDefaultPrevented()) return
        $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
      })
    }

    function getParent($this) {
      var selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      var $parent = selector && $(selector)

      return $parent && $parent.length ? $parent : $this.parent()
    }


    // DROPDOWN PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
      return this.each(function () {
        var $this = $(this)
        var data  = $this.data('bs.dropdown')

        if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
        if (typeof option == 'string') data[option].call($this)
      })
    }

    var old = $.fn.dropdown

    $.fn.dropdown             = Plugin
    $.fn.dropdown.Constructor = Dropdown


    // DROPDOWN NO CONFLICT
    // ====================

    $.fn.dropdown.noConflict = function () {
      $.fn.dropdown = old
      return this
    }


    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
      .on('click.bs.dropdown.data-api', clearMenus)
      .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
      .on('keydown.bs.dropdown.data-api', toggle + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown)

  })

}();

/* ========================================================================
 * Bootstrap: modal.js v3.1.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
      this.options        = options
      this.$body          = $(document.body)
      this.$element       = $(element)
      this.$backdrop      =
      this.isShown        = null
      this.scrollbarWidth = 0

      if (this.options.remote) {
        this.$element
          .find('.modal-content')
          .load(this.options.remote, $.proxy(function () {
            this.$element.trigger('loaded.bs.modal')
          }, this))
      }
    }

    Modal.VERSION  = '3.1.1'

    Modal.DEFAULTS = {
      backdrop: true,
      keyboard: true,
      show: true
    }

    Modal.prototype.toggle = function (_relatedTarget) {
      return this.isShown ? this.hide() : this.show(_relatedTarget)
    }

    Modal.prototype.show = function (_relatedTarget) {
      var that = this
      var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

      this.$element.trigger(e)

      if (this.isShown || e.isDefaultPrevented()) return

      this.isShown = true

      this.checkScrollbar()
      this.$body.addClass('modal-open')

      this.setScrollbar()
      this.escape()

      this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

      this.backdrop(function () {
        var transition = $.support.transition && that.$element.hasClass('fade')

        if (!that.$element.parent().length) {
          that.$element.appendTo(that.$body) // don't move modals dom position
        }

        that.$element
          .show()
          .scrollTop(0)

        if (transition) {
          that.$element[0].offsetWidth // force reflow
        }

        that.$element
          .addClass('in')
          .attr('aria-hidden', false)

        that.enforceFocus()

        var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

        transition ?
          that.$element.find('.modal-dialog') // wait for modal to slide in
            .one('bsTransitionEnd', function () {
              that.$element.trigger('focus').trigger(e)
            })
            .emulateTransitionEnd(300) :
          that.$element.trigger('focus').trigger(e)
      })
    }

    Modal.prototype.hide = function (e) {
      if (e) e.preventDefault()

      e = $.Event('hide.bs.modal')

      this.$element.trigger(e)

      if (!this.isShown || e.isDefaultPrevented()) return

      this.isShown = false

      this.$body.removeClass('modal-open')

      this.resetScrollbar()
      this.escape()

      $(document).off('focusin.bs.modal')

      this.$element
        .removeClass('in')
        .attr('aria-hidden', true)
        .off('click.dismiss.bs.modal')

      $.support.transition && this.$element.hasClass('fade') ?
        this.$element
          .one('bsTransitionEnd', $.proxy(this.hideModal, this))
          .emulateTransitionEnd(300) :
        this.hideModal()
    }

    Modal.prototype.enforceFocus = function () {
      $(document)
        .off('focusin.bs.modal') // guard against infinite focus loop
        .on('focusin.bs.modal', $.proxy(function (e) {
          if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
            this.$element.trigger('focus')
          }
        }, this))
    }

    Modal.prototype.escape = function () {
      if (this.isShown && this.options.keyboard) {
        this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
          e.which == 27 && this.hide()
        }, this))
      } else if (!this.isShown) {
        this.$element.off('keyup.dismiss.bs.modal')
      }
    }

    Modal.prototype.hideModal = function () {
      var that = this
      this.$element.hide()
      this.backdrop(function () {
        that.$element.trigger('hidden.bs.modal')
      })
    }

    Modal.prototype.removeBackdrop = function () {
      this.$backdrop && this.$backdrop.remove()
      this.$backdrop = null
    }

    Modal.prototype.backdrop = function (callback) {
      var that = this
      var animate = this.$element.hasClass('fade') ? 'fade' : ''

      if (this.isShown && this.options.backdrop) {
        var doAnimate = $.support.transition && animate

        this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
          .appendTo(this.$body)

        this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus.call(this.$element[0])
            : this.hide.call(this)
        }, this))

        if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

        this.$backdrop.addClass('in')

        if (!callback) return

        doAnimate ?
          this.$backdrop
            .one('bsTransitionEnd', callback)
            .emulateTransitionEnd(150) :
          callback()

      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass('in')

        var callbackRemove = function () {
          that.removeBackdrop()
          callback && callback()
        }
        $.support.transition && this.$element.hasClass('fade') ?
          this.$backdrop
            .one('bsTransitionEnd', callbackRemove)
            .emulateTransitionEnd(150) :
          callbackRemove()

      } else if (callback) {
        callback()
      }
    }

    Modal.prototype.checkScrollbar = function () {
      if (document.body.clientWidth >= window.innerWidth) return
      this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
    }

    Modal.prototype.setScrollbar = function () {
      var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
      if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
    }

    Modal.prototype.resetScrollbar = function () {
      this.$body.css('padding-right', '')
    }

    Modal.prototype.measureScrollbar = function () { // thx walsh
      var scrollDiv = document.createElement('div')
      scrollDiv.className = 'modal-scrollbar-measure'
      this.$body.append(scrollDiv)
      var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      this.$body[0].removeChild(scrollDiv)
      return scrollbarWidth
    }


    // MODAL PLUGIN DEFINITION
    // =======================

    function Plugin(option, _relatedTarget) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.modal')
        var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

        if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
        if (typeof option == 'string') data[option](_relatedTarget)
        else if (options.show) data.show(_relatedTarget)
      })
    }

    var old = $.fn.modal

    $.fn.modal             = Plugin
    $.fn.modal.Constructor = Modal


    // MODAL NO CONFLICT
    // =================

    $.fn.modal.noConflict = function () {
      $.fn.modal = old
      return this
    }


    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
      var $this   = $(this)
      var href    = $this.attr('href')
      var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

      if ($this.is('a')) e.preventDefault()

      $target.one('show.bs.modal', function (showEvent) {
        if (showEvent.isDefaultPrevented()) return  // only register focus restorer if modal will actually get shown
        $target.one('hidden.bs.modal', function () {
          $this.is(':visible') && $this.trigger('focus')
        })
      })
      Plugin.call($target, option, this)
    })

  })

}();

/* ========================================================================
 * Bootstrap: tooltip.js v3.1.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function (element, options) {
      this.type       =
      this.options    =
      this.enabled    =
      this.timeout    =
      this.hoverState =
      this.$element   = null

      this.init('tooltip', element, options)
    }

    Tooltip.VERSION  = '3.1.1'

    Tooltip.DEFAULTS = {
      animation: true,
      placement: 'top',
      selector: false,
      template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      container: false,
      viewport: {
        selector: 'body',
        padding: 0
      }
    }

    Tooltip.prototype.init = function (type, element, options) {
      this.enabled   = true
      this.type      = type
      this.$element  = $(element)
      this.options   = this.getOptions(options)
      this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

      var triggers = this.options.trigger.split(' ')

      for (var i = triggers.length; i--;) {
        var trigger = triggers[i]

        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
          var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

          this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function () {
      return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function (options) {
      options = $.extend({}, this.getDefaults(), this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay,
          hide: options.delay
        }
      }

      return options
    }

    Tooltip.prototype.getDelegateOptions = function () {
      var options  = {}
      var defaults = this.getDefaults()

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      })

      return options
    }

    Tooltip.prototype.enter = function (obj) {
      var self = obj instanceof this.constructor ?
        obj : $(obj.currentTarget).data('bs.' + this.type)

      if (!self) {
        self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
        $(obj.currentTarget).data('bs.' + this.type, self)
      }

      clearTimeout(self.timeout)

      self.hoverState = 'in'

      if (!self.options.delay || !self.options.delay.show) return self.show()

      self.timeout = setTimeout(function () {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

    Tooltip.prototype.leave = function (obj) {
      var self = obj instanceof this.constructor ?
        obj : $(obj.currentTarget).data('bs.' + this.type)

      if (!self) {
        self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
        $(obj.currentTarget).data('bs.' + this.type, self)
      }

      clearTimeout(self.timeout)

      self.hoverState = 'out'

      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.timeout = setTimeout(function () {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function () {
      var e = $.Event('show.bs.' + this.type)

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)

        var inDom = $.contains(document.documentElement, this.$element[0])
        if (e.isDefaultPrevented() || !inDom) return
        var that = this

        var $tip = this.tip()

        var tipId = this.getUID(this.type)

        this.setContent()
        $tip.attr('id', tipId)
        this.$element.attr('aria-describedby', tipId)

        if (this.options.animation) $tip.addClass('fade')

        var placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        var autoToken = /\s?auto?\s?/i
        var autoPlace = autoToken.test(placement)
        if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })
          .addClass(placement)
          .data('bs.' + this.type, this)

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        var pos          = this.getPosition()
        var actualWidth  = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (autoPlace) {
          var orgPlacement = placement
          var $parent      = this.$element.parent()
          var parentDim    = this.getPosition($parent)

          placement = placement == 'bottom' && pos.top   + pos.height       + actualHeight - parentDim.scroll > parentDim.height ? 'top'    :
                      placement == 'top'    && pos.top   - parentDim.scroll - actualHeight < 0                                   ? 'bottom' :
                      placement == 'right'  && pos.right + actualWidth      > parentDim.width                                    ? 'left'   :
                      placement == 'left'   && pos.left  - actualWidth      < parentDim.left                                     ? 'right'  :
                      placement

          $tip
            .removeClass(orgPlacement)
            .addClass(placement)
        }

        var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

        this.applyPlacement(calculatedOffset, placement)

        var complete = function () {
          that.$element.trigger('shown.bs.' + that.type)
          that.hoverState = null
        }

        $.support.transition && this.$tip.hasClass('fade') ?
          $tip
            .one('bsTransitionEnd', complete)
            .emulateTransitionEnd(150) :
          complete()
      }
    }

    Tooltip.prototype.applyPlacement = function (offset, placement) {
      var $tip   = this.tip()
      var width  = $tip[0].offsetWidth
      var height = $tip[0].offsetHeight

      // manually read margins because getBoundingClientRect includes difference
      var marginTop = parseInt($tip.css('margin-top'), 10)
      var marginLeft = parseInt($tip.css('margin-left'), 10)

      // we must check for NaN for ie 8/9
      if (isNaN(marginTop))  marginTop  = 0
      if (isNaN(marginLeft)) marginLeft = 0

      offset.top  = offset.top  + marginTop
      offset.left = offset.left + marginLeft

      // $.fn.offset doesn't round pixel values
      // so we use setOffset directly with our own function B-0
      $.offset.setOffset($tip[0], $.extend({
        using: function (props) {
          $tip.css({
            top: Math.round(props.top),
            left: Math.round(props.left)
          })
        }
      }, offset), 0)

      $tip.addClass('in')

      // check to see if placing tip in new offset caused the tip to resize itself
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
      }

      var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

      if (delta.left) offset.left += delta.left
      else offset.top += delta.top

      var arrowDelta          = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
      var arrowPosition       = delta.left ? 'left'        : 'top'
      var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight'

      $tip.offset(offset)
      this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition)
    }

    Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
      this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
    }

    Tooltip.prototype.setContent = function () {
      var $tip  = this.tip()
      var title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function () {
      var that = this
      var $tip = this.tip()
      var e    = $.Event('hide.bs.' + this.type)

      this.$element.removeAttr('aria-describedby')

      function complete() {
        if (that.hoverState != 'in') $tip.detach()
        that.$element.trigger('hidden.bs.' + that.type)
      }

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(150) :
        complete()

      this.hoverState = null

      return this
    }

    Tooltip.prototype.fixTitle = function () {
      var $e = this.$element
      if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

    Tooltip.prototype.hasContent = function () {
      return this.getTitle()
    }

    Tooltip.prototype.getPosition = function ($element) {
      $element   = $element || this.$element
      var el     = $element[0]
      var isBody = el.tagName == 'BODY'
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
        scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
        width:  isBody ? $(window).width()  : $element.outerWidth(),
        height: isBody ? $(window).height() : $element.outerHeight()
      }, isBody ? { top: 0, left: 0 } : $element.offset())
    }

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
      return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
             placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
             placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
          /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

    }

    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
      var delta = { top: 0, left: 0 }
      if (!this.$viewport) return delta

      var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
      var viewportDimensions = this.getPosition(this.$viewport)

      if (/right|left/.test(placement)) {
        var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
        var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
        if (topEdgeOffset < viewportDimensions.top) { // top overflow
          delta.top = viewportDimensions.top - topEdgeOffset
        } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
          delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
        }
      } else {
        var leftEdgeOffset  = pos.left - viewportPadding
        var rightEdgeOffset = pos.left + viewportPadding + actualWidth
        if (leftEdgeOffset < viewportDimensions.left) { // left overflow
          delta.left = viewportDimensions.left - leftEdgeOffset
        } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
          delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
        }
      }

      return delta
    }

    Tooltip.prototype.getTitle = function () {
      var title
      var $e = this.$element
      var o  = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

    Tooltip.prototype.getUID = function (prefix) {
      do prefix += ~~(Math.random() * 1000000)
      while (document.getElementById(prefix))
      return prefix
    }

    Tooltip.prototype.tip = function () {
      return (this.$tip = this.$tip || $(this.options.template))
    }

    Tooltip.prototype.arrow = function () {
      return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }

    Tooltip.prototype.validate = function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options  = null
      }
    }

    Tooltip.prototype.enable = function () {
      this.enabled = true
    }

    Tooltip.prototype.disable = function () {
      this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function () {
      this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function (e) {
      var self = this
      if (e) {
        self = $(e.currentTarget).data('bs.' + this.type)
        if (!self) {
          self = new this.constructor(e.currentTarget, this.getDelegateOptions())
          $(e.currentTarget).data('bs.' + this.type, self)
        }
      }

      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }

    Tooltip.prototype.destroy = function () {
      clearTimeout(this.timeout)
      this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
    }


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.tooltip')
        var options = typeof option == 'object' && option

        if (!data && option == 'destroy') return
        if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }

    var old = $.fn.tooltip

    $.fn.tooltip             = Plugin
    $.fn.tooltip.Constructor = Tooltip


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
      $.fn.tooltip = old
      return this
    }

  })

}();

/* ========================================================================
 * Bootstrap: popover.js v3.1.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var Popover = function (element, options) {
      this.init('popover', element, options)
    }

    if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

    Popover.VERSION  = '3.1.1'

    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
      placement: 'right',
      trigger: 'click',
      content: '',
      template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    })


    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================

    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

    Popover.prototype.constructor = Popover

    Popover.prototype.getDefaults = function () {
      return Popover.DEFAULTS
    }

    Popover.prototype.setContent = function () {
      var $tip    = this.tip()
      var title   = this.getTitle()
      var content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content').empty()[ // we use append for html objects to maintain js events
        this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
      ](content)

      $tip.removeClass('fade top bottom left right in')

      // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
      // this manually by checking the contents.
      if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
    }

    Popover.prototype.hasContent = function () {
      return this.getTitle() || this.getContent()
    }

    Popover.prototype.getContent = function () {
      var $e = this.$element
      var o  = this.options

      return $e.attr('data-content')
        || (typeof o.content == 'function' ?
              o.content.call($e[0]) :
              o.content)
    }

    Popover.prototype.arrow = function () {
      return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
    }

    Popover.prototype.tip = function () {
      if (!this.$tip) this.$tip = $(this.options.template)
      return this.$tip
    }


    // POPOVER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.popover')
        var options = typeof option == 'object' && option

        if (!data && option == 'destroy') return
        if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }

    var old = $.fn.popover

    $.fn.popover             = Plugin
    $.fn.popover.Constructor = Popover


    // POPOVER NO CONFLICT
    // ===================

    $.fn.popover.noConflict = function () {
      $.fn.popover = old
      return this
    }

  })

}();

/* ========================================================================
 * Bootstrap: scrollspy.js v3.1.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // SCROLLSPY CLASS DEFINITION
    // ==========================

    function ScrollSpy(element, options) {
      var process  = $.proxy(this.process, this)

      this.$body          = $('body')
      this.$scrollElement = $(element).is('body') ? $(window) : $(element)
      this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
      this.selector       = (this.options.target || '') + ' .nav li > a'
      this.offsets        = []
      this.targets        = []
      this.activeTarget   = null
      this.scrollHeight   = 0

      this.$scrollElement.on('scroll.bs.scrollspy', process)
      this.refresh()
      this.process()
    }

    ScrollSpy.VERSION  = '3.1.1'

    ScrollSpy.DEFAULTS = {
      offset: 10
    }

    ScrollSpy.prototype.getScrollHeight = function () {
      return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }

    ScrollSpy.prototype.refresh = function () {
      var offsetMethod = 'offset'
      var offsetBase   = 0

      if (!$.isWindow(this.$scrollElement[0])) {
        offsetMethod = 'position'
        offsetBase   = this.$scrollElement.scrollTop()
      }

      this.offsets = []
      this.targets = []
      this.scrollHeight = this.getScrollHeight()

      var self     = this

      this.$body
        .find(this.selector)
        .map(function () {
          var $el   = $(this)
          var href  = $el.data('target') || $el.attr('href')
          var $href = /^#./.test(href) && $(href)

          return ($href
            && $href.length
            && $href.is(':visible')
            && [[$href[offsetMethod]().top + offsetBase, href]]) || null
        })
        .sort(function (a, b) { return a[0] - b[0] })
        .each(function () {
          self.offsets.push(this[0])
          self.targets.push(this[1])
        })
    }

    ScrollSpy.prototype.process = function () {
      var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
      var scrollHeight = this.getScrollHeight()
      var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
      var offsets      = this.offsets
      var targets      = this.targets
      var activeTarget = this.activeTarget
      var i

      if (this.scrollHeight != scrollHeight) {
        this.refresh()
      }

      if (scrollTop >= maxScroll) {
        return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
      }

      if (activeTarget && scrollTop <= offsets[0]) {
        return activeTarget != (i = targets[0]) && this.activate(i)
      }

      for (i = offsets.length; i--;) {
        activeTarget != targets[i]
          && scrollTop >= offsets[i]
          && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
          && this.activate(targets[i])
      }
    }

    ScrollSpy.prototype.activate = function (target) {
      this.activeTarget = target

      $(this.selector)
        .parentsUntil(this.options.target, '.active')
        .removeClass('active')

      var selector = this.selector +
          '[data-target="' + target + '"],' +
          this.selector + '[href="' + target + '"]'

      var active = $(selector)
        .parents('li')
        .addClass('active')

      if (active.parent('.dropdown-menu').length) {
        active = active
          .closest('li.dropdown')
          .addClass('active')
      }

      active.trigger('activate.bs.scrollspy')
    }


    // SCROLLSPY PLUGIN DEFINITION
    // ===========================

    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.scrollspy')
        var options = typeof option == 'object' && option

        if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }

    var old = $.fn.scrollspy

    $.fn.scrollspy             = Plugin
    $.fn.scrollspy.Constructor = ScrollSpy


    // SCROLLSPY NO CONFLICT
    // =====================

    $.fn.scrollspy.noConflict = function () {
      $.fn.scrollspy = old
      return this
    }


    // SCROLLSPY DATA-API
    // ==================

    $(window).on('load.bs.scrollspy.data-api', function () {
      $('[data-spy="scroll"]').each(function () {
        var $spy = $(this)
        Plugin.call($spy, $spy.data())
      })
    })

  })

}();

/* ========================================================================
 * Bootstrap: tab.js v3.1.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // TAB CLASS DEFINITION
    // ====================

    var Tab = function (element) {
      this.element = $(element)
    }

    Tab.VERSION = '3.1.1'

    Tab.prototype.show = function () {
      var $this    = this.element
      var $ul      = $this.closest('ul:not(.dropdown-menu)')
      var selector = $this.data('target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ($this.parent('li').hasClass('active')) return

      var previous = $ul.find('.active:last a')[0]
      var e        = $.Event('show.bs.tab', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      var $target = $(selector)

      this.activate($this.closest('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown.bs.tab',
          relatedTarget: previous
        })
      })
    }

    Tab.prototype.activate = function (element, container, callback) {
      var $active    = container.find('> .active')
      var transition = callback
        && $.support.transition
        && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if (element.parent('.dropdown-menu')) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active
          .one('bsTransitionEnd', next)
          .emulateTransitionEnd(150) :
        next()

      $active.removeClass('in')
    }


    // TAB PLUGIN DEFINITION
    // =====================

    function Plugin(option) {
      return this.each(function () {
        var $this = $(this)
        var data  = $this.data('bs.tab')

        if (!data) $this.data('bs.tab', (data = new Tab(this)))
        if (typeof option == 'string') data[option]()
      })
    }

    var old = $.fn.tab

    $.fn.tab             = Plugin
    $.fn.tab.Constructor = Tab


    // TAB NO CONFLICT
    // ===============

    $.fn.tab.noConflict = function () {
      $.fn.tab = old
      return this
    }


    // TAB DATA-API
    // ============

    $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      Plugin.call($(this), 'show')
    })

  })

}();

/* ========================================================================
 * Bootstrap: affix.js v3.1.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function () { 'use strict';

  (function (o_o) {
    typeof define  == 'function' && define.amd ? define(['jquery'], o_o) :
    typeof exports == 'object' ? o_o(require('jquery')) : o_o(jQuery)
  })(function ($) {

    // AFFIX CLASS DEFINITION
    // ======================

    var Affix = function (element, options) {
      this.options = $.extend({}, Affix.DEFAULTS, options)

      this.$target = $(this.options.target)
        .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
        .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

      this.$element     = $(element)
      this.affixed      =
      this.unpin        =
      this.pinnedOffset = null

      this.checkPosition()
    }

    Affix.VERSION  = '3.1.1'

    Affix.RESET    = 'affix affix-top affix-bottom'

    Affix.DEFAULTS = {
      offset: 0,
      target: window
    }

    Affix.prototype.getPinnedOffset = function () {
      if (this.pinnedOffset) return this.pinnedOffset
      this.$element.removeClass(Affix.RESET).addClass('affix')
      var scrollTop = this.$target.scrollTop()
      var position  = this.$element.offset()
      return (this.pinnedOffset = position.top - scrollTop)
    }

    Affix.prototype.checkPositionWithEventLoop = function () {
      setTimeout($.proxy(this.checkPosition, this), 1)
    }

    Affix.prototype.checkPosition = function () {
      if (!this.$element.is(':visible')) return

      var scrollHeight = $(document).height()
      var scrollTop    = this.$target.scrollTop()
      var position     = this.$element.offset()
      var offset       = this.options.offset
      var offsetTop    = offset.top
      var offsetBottom = offset.bottom

      if (typeof offset != 'object')         offsetBottom = offsetTop = offset
      if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
      if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

      var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                  offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                  offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

      if (this.affixed === affix) return
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger($.Event(affixType.replace('affix', 'affixed')))

      if (affix == 'bottom') {
        this.$element.offset({
          top: scrollHeight - this.$element.height() - offsetBottom
        })
      }
    }


    // AFFIX PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
      return this.each(function () {
        var $this   = $(this)
        var data    = $this.data('bs.affix')
        var options = typeof option == 'object' && option

        if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
        if (typeof option == 'string') data[option]()
      })
    }

    var old = $.fn.affix

    $.fn.affix             = Plugin
    $.fn.affix.Constructor = Affix


    // AFFIX NO CONFLICT
    // =================

    $.fn.affix.noConflict = function () {
      $.fn.affix = old
      return this
    }


    // AFFIX DATA-API
    // ==============

    $(window).on('load', function () {
      $('[data-spy="affix"]').each(function () {
        var $spy = $(this)
        var data = $spy.data()

        data.offset = data.offset || {}

        if (data.offsetBottom) data.offset.bottom = data.offsetBottom
        if (data.offsetTop)    data.offset.top    = data.offsetTop

        Plugin.call($spy, data)
      })
    })

  })

}();

/**
 * Isotope v1.5.26
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://isotope.metafizzy.co/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright 2014 Metafizzy
 */

/*jshint asi: true, browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function( window, $, undefined ){

  'use strict';

  // get global vars
  var document = window.document;
  var docElem = document.documentElement;
  var Modernizr = window.Modernizr;

  // helper function
  var capitalize = function( str ) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // ========================= getStyleProperty by kangax ===============================
  // http://perfectionkills.com/feature-testing-css-properties/

  var prefixes = 'Moz Webkit O Ms'.split(' ');

  var getStyleProperty = function( propName ) {
    var style = docElem.style,
        prefixed;

    // test standard property first
    if ( typeof style[propName] === 'string' ) {
      return propName;
    }

    // capitalize
    propName = capitalize( propName );

    // test vendor specific properties
    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      prefixed = prefixes[i] + propName;
      if ( typeof style[ prefixed ] === 'string' ) {
        return prefixed;
      }
    }
  };

  var transformProp = getStyleProperty('transform'),
      transitionProp = getStyleProperty('transitionProperty');


  // ========================= miniModernizr ===============================
  // <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting

  /*!
   * Modernizr v1.6ish: miniModernizr for Isotope
   * http://www.modernizr.com
   *
   * Developed by:
   * - Faruk Ates  http://farukat.es/
   * - Paul Irish  http://paulirish.com/
   *
   * Copyright (c) 2009-2010
   * Dual-licensed under the BSD or MIT licenses.
   * http://www.modernizr.com/license/
   */

  /*
   * This version whittles down the script just to check support for
   * CSS transitions, transforms, and 3D transforms.
  */

  var tests = {
    csstransforms: function() {
      return !!transformProp;
    },

    csstransforms3d: function() {
      var test = !!getStyleProperty('perspective');
      // double check for Chrome's false positive
      if ( test && 'webkitPerspective' in docElem.style ) {
        var $style = $('<style>@media (transform-3d),(-webkit-transform-3d)' +
              '{#modernizr{height:3px}}</style>').appendTo('head'),
            $div = $('<div id="modernizr" />').appendTo('html');

        test = $div.height() === 3;

        $div.remove();
        $style.remove();
      }
      return test;
    },

    csstransitions: function() {
      return !!transitionProp;
    }
  };

  var testName;

  if ( Modernizr ) {
    // if there's a previous Modernzir, check if there are necessary tests
    for ( testName in tests) {
      if ( !Modernizr.hasOwnProperty( testName ) ) {
        // if test hasn't been run, use addTest to run it
        Modernizr.addTest( testName, tests[ testName ] );
      }
    }
  } else {
    // or create new mini Modernizr that just has the 3 tests
    Modernizr = window.Modernizr = {
      _version : '1.6ish: miniModernizr for Isotope'
    };

    var classes = ' ';
    var result;

    // Run through tests
    for ( testName in tests) {
      result = tests[ testName ]();
      Modernizr[ testName ] = result;
      classes += ' ' + ( result ?  '' : 'no-' ) + testName;
    }

    // Add the new classes to the <html> element.
    $('html').addClass( classes );
  }


  // ========================= isoTransform ===============================

  /**
   *  provides hooks for .css({ scale: value, translate: [x, y] })
   *  Progressively enhanced CSS transforms
   *  Uses hardware accelerated 3D transforms for Safari
   *  or falls back to 2D transforms.
   */

  if ( Modernizr.csstransforms ) {

        // i.e. transformFnNotations.scale(0.5) >> 'scale3d( 0.5, 0.5, 1)'
    var transformFnNotations = Modernizr.csstransforms3d ?
      { // 3D transform functions
        translate : function ( position ) {
          return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) ';
        },
        scale : function ( scale ) {
          return 'scale3d(' + scale + ', ' + scale + ', 1) ';
        }
      } :
      { // 2D transform functions
        translate : function ( position ) {
          return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
        },
        scale : function ( scale ) {
          return 'scale(' + scale + ') ';
        }
      }
    ;

    var setIsoTransform = function ( elem, name, value ) {
          // unpack current transform data
      var data =  $.data( elem, 'isoTransform' ) || {},
          newData = {},
          fnName,
          transformObj = {},
          transformValue;

      // i.e. newData.scale = 0.5
      newData[ name ] = value;
      // extend new value over current data
      $.extend( data, newData );

      for ( fnName in data ) {
        transformValue = data[ fnName ];
        transformObj[ fnName ] = transformFnNotations[ fnName ]( transformValue );
      }

      // get proper order
      // ideally, we could loop through this give an array, but since we only have
      // a couple transforms we're keeping track of, we'll do it like so
      var translateFn = transformObj.translate || '',
          scaleFn = transformObj.scale || '',
          // sorting so translate always comes first
          valueFns = translateFn + scaleFn;

      // set data back in elem
      $.data( elem, 'isoTransform', data );

      // set name to vendor specific property
      elem.style[ transformProp ] = valueFns;
    };

    // ==================== scale ===================

    $.cssNumber.scale = true;

    $.cssHooks.scale = {
      set: function( elem, value ) {
        // uncomment this bit if you want to properly parse strings
        // if ( typeof value === 'string' ) {
        //   value = parseFloat( value );
        // }
        setIsoTransform( elem, 'scale', value );
      },
      get: function( elem, computed ) {
        var transform = $.data( elem, 'isoTransform' );
        return transform && transform.scale ? transform.scale : 1;
      }
    };

    $.fx.step.scale = function( fx ) {
      $.cssHooks.scale.set( fx.elem, fx.now+fx.unit );
    };


    // ==================== translate ===================

    $.cssNumber.translate = true;

    $.cssHooks.translate = {
      set: function( elem, value ) {

        // uncomment this bit if you want to properly parse strings
        // if ( typeof value === 'string' ) {
        //   value = value.split(' ');
        // }
        //
        // var i, val;
        // for ( i = 0; i < 2; i++ ) {
        //   val = value[i];
        //   if ( typeof val === 'string' ) {
        //     val = parseInt( val );
        //   }
        // }

        setIsoTransform( elem, 'translate', value );
      },

      get: function( elem, computed ) {
        var transform = $.data( elem, 'isoTransform' );
        return transform && transform.translate ? transform.translate : [ 0, 0 ];
      }
    };

  }

  // ========================= get transition-end event ===============================
  var transitionEndEvent, transitionDurProp;

  if ( Modernizr.csstransitions ) {
    transitionEndEvent = {
      WebkitTransitionProperty: 'webkitTransitionEnd',  // webkit
      MozTransitionProperty: 'transitionend',
      OTransitionProperty: 'oTransitionEnd otransitionend',
      transitionProperty: 'transitionend'
    }[ transitionProp ];

    transitionDurProp = getStyleProperty('transitionDuration');
  }

  // ========================= smartresize ===============================

  /*
   * smartresize: debounced resize event for jQuery
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.smartresize.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   */

  var $event = $.event,
      dispatchMethod = $.event.handle ? 'handle' : 'dispatch',
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        $event[ dispatchMethod ].apply( context, args );
      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };



// ========================= Isotope ===============================


  // our "Widget" object constructor
  $.Isotope = function( options, element, callback ){
    this.element = $( element );

    this._create( options );
    this._init( callback );
  };

  // styles of container element we want to keep track of
  var isoContainerStyles = [ 'width', 'height' ];

  var $window = $(window);

  $.Isotope.settings = {
    resizable: true,
    layoutMode : 'masonry',
    containerClass : 'isotope',
    itemClass : 'isotope-item',
    hiddenClass : 'isotope-hidden',
    hiddenStyle: { opacity: 0, scale: 0.001 },
    visibleStyle: { opacity: 1, scale: 1 },
    containerStyle: {
      position: 'relative',
      overflow: 'hidden'
    },
    animationEngine: 'best-available',
    animationOptions: {
      queue: false,
      duration: 800
    },
    sortBy : 'original-order',
    sortAscending : true,
    resizesContainer : true,
    transformsEnabled: true,
    itemPositionDataEnabled: false
  };

  $.Isotope.prototype = {

    // sets up widget
    _create : function( options ) {

      this.options = $.extend( {}, $.Isotope.settings, options );

      this.styleQueue = [];
      this.elemCount = 0;

      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {};
      // keep track of container styles
      var containerStyles = isoContainerStyles.slice(0);
      for ( var prop in this.options.containerStyle ) {
        containerStyles.push( prop );
      }
      for ( var i=0, len = containerStyles.length; i < len; i++ ) {
        prop = containerStyles[i];
        this.originalStyle[ prop ] = elemStyle[ prop ] || '';
      }
      // apply container style from options
      this.element.css( this.options.containerStyle );

      this._updateAnimationEngine();
      this._updateUsingTransforms();

      // sorting
      var originalOrderSorter = {
        'original-order' : function( $elem, instance ) {
          instance.elemCount ++;
          return instance.elemCount;
        },
        random : function() {
          return Math.random();
        }
      };

      this.options.getSortData = $.extend( this.options.getSortData, originalOrderSorter );

      // need to get atoms
      this.reloadItems();

      // get top left position of where the bricks should be
      this.offset = {
        left: parseInt( ( this.element.css('padding-left') || 0 ), 10 ),
        top: parseInt( ( this.element.css('padding-top') || 0 ), 10 )
      };

      // add isotope class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass( instance.options.containerClass );
      }, 0 );

      // bind resize method
      if ( this.options.resizable ) {
        $window.bind( 'smartresize.isotope', function() {
          instance.resize();
        });
      }

      // dismiss all click events from hidden events
      this.element.delegate( '.' + this.options.hiddenClass, 'click', function(){
        return false;
      });

    },

    _getAtoms : function( $elems ) {
      var selector = this.options.itemSelector,
          // filter & find
          $atoms = selector ? $elems.filter( selector ).add( $elems.find( selector ) ) : $elems,
          // base style for atoms
          atomStyle = { position: 'absolute' };

      // filter out text nodes
      $atoms = $atoms.filter( function( i, atom ) {
        return atom.nodeType === 1;
      });

      if ( this.usingTransforms ) {
        atomStyle.left = 0;
        atomStyle.top = 0;
      }

      $atoms.css( atomStyle ).addClass( this.options.itemClass );

      this.updateSortData( $atoms, true );

      return $atoms;
    },

    // _init fires when your instance is first created
    // (from the constructor above), and when you
    // attempt to initialize the widget again (by the bridge)
    // after it has already been initialized.
    _init : function( callback ) {

      this.$filteredAtoms = this._filter( this.$allAtoms );
      this._sort();
      this.reLayout( callback );

    },

    option : function( opts ){
      // change options AFTER initialization:
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( opts ) ){
        this.options = $.extend( true, this.options, opts );

        // trigger _updateOptionName if it exists
        var updateOptionFn;
        for ( var optionName in opts ) {
          updateOptionFn = '_update' + capitalize( optionName );
          if ( this[ updateOptionFn ] ) {
            this[ updateOptionFn ]();
          }
        }
      }
    },

    // ====================== updaters ====================== //
    // kind of like setters

    _updateAnimationEngine : function() {
      var animationEngine = this.options.animationEngine.toLowerCase().replace( /[ _\-]/g, '');
      var isUsingJQueryAnimation;
      // set applyStyleFnName
      switch ( animationEngine ) {
        case 'css' :
        case 'none' :
          isUsingJQueryAnimation = false;
          break;
        case 'jquery' :
          isUsingJQueryAnimation = true;
          break;
        default : // best available
          isUsingJQueryAnimation = !Modernizr.csstransitions;
      }
      this.isUsingJQueryAnimation = isUsingJQueryAnimation;
      this._updateUsingTransforms();
    },

    _updateTransformsEnabled : function() {
      this._updateUsingTransforms();
    },

    _updateUsingTransforms : function() {
      var usingTransforms = this.usingTransforms = this.options.transformsEnabled &&
        Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;

      // prevent scales when transforms are disabled
      if ( !usingTransforms ) {
        delete this.options.hiddenStyle.scale;
        delete this.options.visibleStyle.scale;
      }

      this.getPositionStyles = usingTransforms ? this._translate : this._positionAbs;
    },


    // ====================== Filtering ======================

    _filter : function( $atoms ) {
      var filter = this.options.filter === '' ? '*' : this.options.filter;

      if ( !filter ) {
        return $atoms;
      }

      var hiddenClass    = this.options.hiddenClass,
          hiddenSelector = '.' + hiddenClass,
          $hiddenAtoms   = $atoms.filter( hiddenSelector ),
          $atomsToShow   = $hiddenAtoms;

      if ( filter !== '*' ) {
        $atomsToShow = $hiddenAtoms.filter( filter );
        var $atomsToHide = $atoms.not( hiddenSelector ).not( filter ).addClass( hiddenClass );
        this.styleQueue.push({ $el: $atomsToHide, style: this.options.hiddenStyle });
      }

      this.styleQueue.push({ $el: $atomsToShow, style: this.options.visibleStyle });
      $atomsToShow.removeClass( hiddenClass );

      return $atoms.filter( filter );
    },

    // ====================== Sorting ======================

    updateSortData : function( $atoms, isIncrementingElemCount ) {
      var instance = this,
          getSortData = this.options.getSortData,
          $this, sortData;
      $atoms.each(function(){
        $this = $(this);
        sortData = {};
        // get value for sort data based on fn( $elem ) passed in
        for ( var key in getSortData ) {
          if ( !isIncrementingElemCount && key === 'original-order' ) {
            // keep original order original
            sortData[ key ] = $.data( this, 'isotope-sort-data' )[ key ];
          } else {
            sortData[ key ] = getSortData[ key ]( $this, instance );
          }
        }
        // apply sort data to element
        $.data( this, 'isotope-sort-data', sortData );
      });
    },

    // used on all the filtered atoms
    _sort : function() {

      var sortBy = this.options.sortBy,
          getSorter = this._getSorter,
          sortDir = this.options.sortAscending ? 1 : -1,
          sortFn = function( alpha, beta ) {
            var a = getSorter( alpha, sortBy ),
                b = getSorter( beta, sortBy );
            // fall back to original order if data matches
            if ( a === b && sortBy !== 'original-order') {
              a = getSorter( alpha, 'original-order' );
              b = getSorter( beta, 'original-order' );
            }
            return ( ( a > b ) ? 1 : ( a < b ) ? -1 : 0 ) * sortDir;
          };

      this.$filteredAtoms.sort( sortFn );
    },

    _getSorter : function( elem, sortBy ) {
      return $.data( elem, 'isotope-sort-data' )[ sortBy ];
    },

    // ====================== Layout Helpers ======================

    _translate : function( x, y ) {
      return { translate : [ x, y ] };
    },

    _positionAbs : function( x, y ) {
      return { left: x, top: y };
    },

    _pushPosition : function( $elem, x, y ) {
      x = Math.round( x + this.offset.left );
      y = Math.round( y + this.offset.top );
      var position = this.getPositionStyles( x, y );
      this.styleQueue.push({ $el: $elem, style: position });
      if ( this.options.itemPositionDataEnabled ) {
        $elem.data('isotope-item-position', {x: x, y: y} );
      }
    },


    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $elems, callback ) {

      var layoutMode = this.options.layoutMode;

      // layout logic
      this[ '_' +  layoutMode + 'Layout' ]( $elems );

      // set the size of the container
      if ( this.options.resizesContainer ) {
        var containerStyle = this[ '_' +  layoutMode + 'GetContainerSize' ]();
        this.styleQueue.push({ $el: this.element, style: containerStyle });
      }

      this._processStyleQueue( $elems, callback );

      this.isLaidOut = true;
    },

    _processStyleQueue : function( $elems, callback ) {
      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = !this.isLaidOut ? 'css' : (
            this.isUsingJQueryAnimation ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions,
          onLayout = this.options.onLayout,
          objStyleFn, processor,
          triggerCallbackNow, callbackFn;

      // default styleQueue processor, may be overwritten down below
      processor = function( i, obj ) {
        obj.$el[ styleFn ]( obj.style, animOpts );
      };

      if ( this._isInserting && this.isUsingJQueryAnimation ) {
        // if using styleQueue to insert items
        processor = function( i, obj ) {
          // only animate if it not being inserted
          objStyleFn = obj.$el.hasClass('no-transition') ? 'css' : styleFn;
          obj.$el[ objStyleFn ]( obj.style, animOpts );
        };

      } else if ( callback || onLayout || animOpts.complete ) {
        // has callback
        var isCallbackTriggered = false,
            // array of possible callbacks to trigger
            callbacks = [ callback, onLayout, animOpts.complete ],
            instance = this;
        triggerCallbackNow = true;
        // trigger callback only once
        callbackFn = function() {
          if ( isCallbackTriggered ) {
            return;
          }
          var hollaback;
          for (var i=0, len = callbacks.length; i < len; i++) {
            hollaback = callbacks[i];
            if ( typeof hollaback === 'function' ) {
              hollaback.call( instance.element, $elems, instance );
            }
          }
          isCallbackTriggered = true;
        };

        if ( this.isUsingJQueryAnimation && styleFn === 'animate' ) {
          // add callback to animation options
          animOpts.complete = callbackFn;
          triggerCallbackNow = false;

        } else if ( Modernizr.csstransitions ) {
          // detect if first item has transition
          var i = 0,
              firstItem = this.styleQueue[0],
              testElem = firstItem && firstItem.$el,
              styleObj;
          // get first non-empty jQ object
          while ( !testElem || !testElem.length ) {
            styleObj = this.styleQueue[ i++ ];
            // HACK: sometimes styleQueue[i] is undefined
            if ( !styleObj ) {
              return;
            }
            testElem = styleObj.$el;
          }
          // get transition duration of the first element in that object
          // yeah, this is inexact
          var duration = parseFloat( getComputedStyle( testElem[0] )[ transitionDurProp ] );
          if ( duration > 0 ) {
            processor = function( i, obj ) {
              obj.$el[ styleFn ]( obj.style, animOpts )
                // trigger callback at transition end
                .one( transitionEndEvent, callbackFn );
            };
            triggerCallbackNow = false;
          }
        }
      }

      // process styleQueue
      $.each( this.styleQueue, processor );

      if ( triggerCallbackNow ) {
        callbackFn();
      }

      // clear out queue for next time
      this.styleQueue = [];
    },


    resize : function() {
      if ( this[ '_' + this.options.layoutMode + 'ResizeChanged' ]() ) {
        this.reLayout();
      }
    },


    reLayout : function( callback ) {

      this[ '_' +  this.options.layoutMode + 'Reset' ]();
      this.layout( this.$filteredAtoms, callback );

    },

    // ====================== Convenience methods ======================

    // ====================== Adding items ======================

    // adds a jQuery object of items to a isotope container
    addItems : function( $content, callback ) {
      var $newAtoms = this._getAtoms( $content );
      // add new atoms to atoms pools
      this.$allAtoms = this.$allAtoms.add( $newAtoms );

      if ( callback ) {
        callback( $newAtoms );
      }
    },

    // convienence method for adding elements properly to any layout
    // positions items, hides them, then animates them back in <--- very sezzy
    insert : function( $content, callback ) {
      // position items
      this.element.append( $content );

      var instance = this;
      this.addItems( $content, function( $newAtoms ) {
        var $newFilteredAtoms = instance._filter( $newAtoms );
        instance._addHideAppended( $newFilteredAtoms );
        instance._sort();
        instance.reLayout();
        instance._revealAppended( $newFilteredAtoms, callback );
      });

    },

    // convienence method for working with Infinite Scroll
    appended : function( $content, callback ) {
      var instance = this;
      this.addItems( $content, function( $newAtoms ) {
        instance._addHideAppended( $newAtoms );
        instance.layout( $newAtoms );
        instance._revealAppended( $newAtoms, callback );
      });
    },

    // adds new atoms, then hides them before positioning
    _addHideAppended : function( $newAtoms ) {
      this.$filteredAtoms = this.$filteredAtoms.add( $newAtoms );
      $newAtoms.addClass('no-transition');

      this._isInserting = true;

      // apply hidden styles
      this.styleQueue.push({ $el: $newAtoms, style: this.options.hiddenStyle });
    },

    // sets visible style on new atoms
    _revealAppended : function( $newAtoms, callback ) {
      var instance = this;
      // apply visible style after a sec
      setTimeout( function() {
        // enable animation
        $newAtoms.removeClass('no-transition');
        // reveal newly inserted filtered elements
        instance.styleQueue.push({ $el: $newAtoms, style: instance.options.visibleStyle });
        instance._isInserting = false;
        instance._processStyleQueue( $newAtoms, callback );
      }, 10 );
    },

    // gathers all atoms
    reloadItems : function() {
      this.$allAtoms = this._getAtoms( this.element.children() );
    },

    // removes elements from Isotope widget
    remove: function( $content, callback ) {
      // remove elements immediately from Isotope instance
      this.$allAtoms = this.$allAtoms.not( $content );
      this.$filteredAtoms = this.$filteredAtoms.not( $content );
      // remove() as a callback, for after transition / animation
      var instance = this;
      var removeContent = function() {
        $content.remove();
        if ( callback ) {
          callback.call( instance.element );
        }
      };

      if ( $content.filter( ':not(.' + this.options.hiddenClass + ')' ).length ) {
        // if any non-hidden content needs to be removed
        this.styleQueue.push({ $el: $content, style: this.options.hiddenStyle });
        this._sort();
        this.reLayout( removeContent );
      } else {
        // remove it now
        removeContent();
      }

    },

    shuffle : function( callback ) {
      this.updateSortData( this.$allAtoms );
      this.options.sortBy = 'random';
      this._sort();
      this.reLayout( callback );
    },

    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      var usingTransforms = this.usingTransforms;
      var options = this.options;

      this.$allAtoms
        .removeClass( options.hiddenClass + ' ' + options.itemClass )
        .each(function(){
          var style = this.style;
          style.position = '';
          style.top = '';
          style.left = '';
          style.opacity = '';
          if ( usingTransforms ) {
            style[ transformProp ] = '';
          }
        });

      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var prop in this.originalStyle ) {
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }

      this.element
        .unbind('.isotope')
        .undelegate( '.' + options.hiddenClass, 'click' )
        .removeClass( options.containerClass )
        .removeData('isotope');

      $window.unbind('.isotope');

    },


    // ====================== LAYOUTS ======================

    // calculates number of rows or columns
    // requires columnWidth or rowHeight to be set on namespaced object
    // i.e. this.masonry.columnWidth = 200
    _getSegments : function( isRows ) {
      var namespace = this.options.layoutMode,
          measure  = isRows ? 'rowHeight' : 'columnWidth',
          size     = isRows ? 'height' : 'width',
          segmentsName = isRows ? 'rows' : 'cols',
          containerSize = this.element[ size ](),
          segments,
                    // i.e. options.masonry && options.masonry.columnWidth
          segmentSize = this.options[ namespace ] && this.options[ namespace ][ measure ] ||
                    // or use the size of the first item, i.e. outerWidth
                    this.$filteredAtoms[ 'outer' + capitalize(size) ](true) ||
                    // if there's no items, use size of container
                    containerSize;

      segments = Math.floor( containerSize / segmentSize );
      segments = Math.max( segments, 1 );

      // i.e. this.masonry.cols = ....
      this[ namespace ][ segmentsName ] = segments;
      // i.e. this.masonry.columnWidth = ...
      this[ namespace ][ measure ] = segmentSize;

    },

    _checkIfSegmentsChanged : function( isRows ) {
      var namespace = this.options.layoutMode,
          segmentsName = isRows ? 'rows' : 'cols',
          prevSegments = this[ namespace ][ segmentsName ];
      // update cols/rows
      this._getSegments( isRows );
      // return if updated cols/rows is not equal to previous
      return ( this[ namespace ][ segmentsName ] !== prevSegments );
    },

    // ====================== Masonry ======================

    _masonryReset : function() {
      // layout-specific props
      this.masonry = {};
      // FIXME shouldn't have to call this again
      this._getSegments();
      var i = this.masonry.cols;
      this.masonry.colYs = [];
      while (i--) {
        this.masonry.colYs.push( 0 );
      }
    },

    _masonryLayout : function( $elems ) {
      var instance = this,
          props = instance.masonry;
      $elems.each(function(){
        var $this  = $(this),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / props.columnWidth );
        colSpan = Math.min( colSpan, props.cols );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryPlaceBrick( $this, props.colYs );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          var groupCount = props.cols + 1 - colSpan,
              groupY = [],
              groupColY,
              i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupColY = props.colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }

          instance._masonryPlaceBrick( $this, groupY );
        }
      });
    },

    // worker method that places brick in the columnSet
    //   with the the minY
    _masonryPlaceBrick : function( $brick, setY ) {
      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, setY ),
          shortCol = 0;

      // Find index of short column, the first from the left
      for (var i=0, len = setY.length; i < len; i++) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var x = this.masonry.columnWidth * shortCol,
          y = minimumY;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.masonry.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.masonry.colYs[ shortCol + i ] = setHeight;
      }

    },

    _masonryGetContainerSize : function() {
      var containerHeight = Math.max.apply( Math, this.masonry.colYs );
      return { height: containerHeight };
    },

    _masonryResizeChanged : function() {
      return this._checkIfSegmentsChanged();
    },

    // ====================== fitRows ======================

    _fitRowsReset : function() {
      this.fitRows = {
        x : 0,
        y : 0,
        height : 0
      };
    },

    _fitRowsLayout : function( $elems ) {
      var instance = this,
          containerWidth = this.element.width(),
          props = this.fitRows;

      $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true);

        if ( props.x !== 0 && atomW + props.x > containerWidth ) {
          // if this element cannot fit in the current row
          props.x = 0;
          props.y = props.height;
        }

        // position the atom
        instance._pushPosition( $this, props.x, props.y );

        props.height = Math.max( props.y + atomH, props.height );
        props.x += atomW;

      });
    },

    _fitRowsGetContainerSize : function () {
      return { height : this.fitRows.height };
    },

    _fitRowsResizeChanged : function() {
      return true;
    },


    // ====================== cellsByRow ======================

    _cellsByRowReset : function() {
      this.cellsByRow = {
        index : 0
      };
      // get this.cellsByRow.columnWidth
      this._getSegments();
      // get this.cellsByRow.rowHeight
      this._getSegments(true);
    },

    _cellsByRowLayout : function( $elems ) {
      var instance = this,
          props = this.cellsByRow;
      $elems.each( function(){
        var $this = $(this),
            col = props.index % props.cols,
            row = Math.floor( props.index / props.cols ),
            x = ( col + 0.5 ) * props.columnWidth - $this.outerWidth(true) / 2,
            y = ( row + 0.5 ) * props.rowHeight - $this.outerHeight(true) / 2;
        instance._pushPosition( $this, x, y );
        props.index ++;
      });
    },

    _cellsByRowGetContainerSize : function() {
      return { height : Math.ceil( this.$filteredAtoms.length / this.cellsByRow.cols ) * this.cellsByRow.rowHeight + this.offset.top };
    },

    _cellsByRowResizeChanged : function() {
      return this._checkIfSegmentsChanged();
    },


    // ====================== straightDown ======================

    _straightDownReset : function() {
      this.straightDown = {
        y : 0
      };
    },

    _straightDownLayout : function( $elems ) {
      var instance = this;
      $elems.each( function( i ){
        var $this = $(this);
        instance._pushPosition( $this, 0, instance.straightDown.y );
        instance.straightDown.y += $this.outerHeight(true);
      });
    },

    _straightDownGetContainerSize : function() {
      return { height : this.straightDown.y };
    },

    _straightDownResizeChanged : function() {
      return true;
    },


    // ====================== masonryHorizontal ======================

    _masonryHorizontalReset : function() {
      // layout-specific props
      this.masonryHorizontal = {};
      // FIXME shouldn't have to call this again
      this._getSegments( true );
      var i = this.masonryHorizontal.rows;
      this.masonryHorizontal.rowXs = [];
      while (i--) {
        this.masonryHorizontal.rowXs.push( 0 );
      }
    },

    _masonryHorizontalLayout : function( $elems ) {
      var instance = this,
          props = instance.masonryHorizontal;
      $elems.each(function(){
        var $this  = $(this),
            //how many rows does this brick span
            rowSpan = Math.ceil( $this.outerHeight(true) / props.rowHeight );
        rowSpan = Math.min( rowSpan, props.rows );

        if ( rowSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryHorizontalPlaceBrick( $this, props.rowXs );
        } else {
          // brick spans more than one row
          // how many different places could this brick fit horizontally
          var groupCount = props.rows + 1 - rowSpan,
              groupX = [],
              groupRowX, i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupRowX = props.rowXs.slice( i, i+rowSpan );
            // and get the max value of the array
            groupX[i] = Math.max.apply( Math, groupRowX );
          }

          instance._masonryHorizontalPlaceBrick( $this, groupX );
        }
      });
    },

    _masonryHorizontalPlaceBrick : function( $brick, setX ) {
      // get the minimum Y value from the columns
      var minimumX  = Math.min.apply( Math, setX ),
          smallRow  = 0;
      // Find index of smallest row, the first from the top
      for (var i=0, len = setX.length; i < len; i++) {
        if ( setX[i] === minimumX ) {
          smallRow = i;
          break;
        }
      }

      // position the brick
      var x = minimumX,
          y = this.masonryHorizontal.rowHeight * smallRow;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      var setWidth = minimumX + $brick.outerWidth(true),
          setSpan = this.masonryHorizontal.rows + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.masonryHorizontal.rowXs[ smallRow + i ] = setWidth;
      }
    },

    _masonryHorizontalGetContainerSize : function() {
      var containerWidth = Math.max.apply( Math, this.masonryHorizontal.rowXs );
      return { width: containerWidth };
    },

    _masonryHorizontalResizeChanged : function() {
      return this._checkIfSegmentsChanged(true);
    },


    // ====================== fitColumns ======================

    _fitColumnsReset : function() {
      this.fitColumns = {
        x : 0,
        y : 0,
        width : 0
      };
    },

    _fitColumnsLayout : function( $elems ) {
      var instance = this,
          containerHeight = this.element.height(),
          props = this.fitColumns;
      $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true);

        if ( props.y !== 0 && atomH + props.y > containerHeight ) {
          // if this element cannot fit in the current column
          props.x = props.width;
          props.y = 0;
        }

        // position the atom
        instance._pushPosition( $this, props.x, props.y );

        props.width = Math.max( props.x + atomW, props.width );
        props.y += atomH;

      });
    },

    _fitColumnsGetContainerSize : function () {
      return { width : this.fitColumns.width };
    },

    _fitColumnsResizeChanged : function() {
      return true;
    },



    // ====================== cellsByColumn ======================

    _cellsByColumnReset : function() {
      this.cellsByColumn = {
        index : 0
      };
      // get this.cellsByColumn.columnWidth
      this._getSegments();
      // get this.cellsByColumn.rowHeight
      this._getSegments(true);
    },

    _cellsByColumnLayout : function( $elems ) {
      var instance = this,
          props = this.cellsByColumn;
      $elems.each( function(){
        var $this = $(this),
            col = Math.floor( props.index / props.rows ),
            row = props.index % props.rows,
            x = ( col + 0.5 ) * props.columnWidth - $this.outerWidth(true) / 2,
            y = ( row + 0.5 ) * props.rowHeight - $this.outerHeight(true) / 2;
        instance._pushPosition( $this, x, y );
        props.index ++;
      });
    },

    _cellsByColumnGetContainerSize : function() {
      return { width : Math.ceil( this.$filteredAtoms.length / this.cellsByColumn.rows ) * this.cellsByColumn.columnWidth };
    },

    _cellsByColumnResizeChanged : function() {
      return this._checkIfSegmentsChanged(true);
    },

    // ====================== straightAcross ======================

    _straightAcrossReset : function() {
      this.straightAcross = {
        x : 0
      };
    },

    _straightAcrossLayout : function( $elems ) {
      var instance = this;
      $elems.each( function( i ){
        var $this = $(this);
        instance._pushPosition( $this, instance.straightAcross.x, 0 );
        instance.straightAcross.x += $this.outerWidth(true);
      });
    },

    _straightAcrossGetContainerSize : function() {
      return { width : this.straightAcross.x };
    },

    _straightAcrossResizeChanged : function() {
      return true;
    }

  };


  // ======================= imagesLoaded Plugin ===============================
  /*!
   * jQuery imagesLoaded plugin v1.1.0
   * http://github.com/desandro/imagesloaded
   *
   * MIT License. by Paul Irish et al.
   */


  // $('#my-container').imagesLoaded(myFunction)
  // or
  // $('img').imagesLoaded(myFunction)

  // execute a callback when all images have loaded.
  // needed because .load() doesn't work on cached images

  // callback function gets image collection as argument
  //  `this` is the container

  $.fn.imagesLoaded = function( callback ) {
    var $this = this,
        $images = $this.find('img').add( $this.filter('img') ),
        len = $images.length,
        blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        loaded = [];

    function triggerCallback() {
      callback.call( $this, $images );
    }

    function imgLoaded( event ) {
      var img = event.target;
      if ( img.src !== blank && $.inArray( img, loaded ) === -1 ){
        loaded.push( img );
        if ( --len <= 0 ){
          setTimeout( triggerCallback );
          $images.unbind( '.imagesLoaded', imgLoaded );
        }
      }
    }

    // if no images, trigger immediately
    if ( !len ) {
      triggerCallback();
    }

    $images.bind( 'load.imagesLoaded error.imagesLoaded',  imgLoaded ).each( function() {
      // cached images don't fire load sometimes, so we reset src.
      var src = this.src;
      // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
      // data uri bypasses webkit log warning (thx doug jones)
      this.src = blank;
      this.src = src;
    });

    return $this;
  };


  // helper function for logging errors
  // $.error breaks jQuery chaining
  var logError = function( message ) {
    if ( window.console ) {
      window.console.error( message );
    }
  };

  // =======================  Plugin bridge  ===============================
  // leverages data method to either create or return $.Isotope constructor
  // A bit from jQuery UI
  //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
  // A bit from jcarousel
  //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

  $.fn.isotope = function( options, callback ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'isotope' );
        if ( !instance ) {
          logError( "cannot call methods on isotope prior to initialization; " +
              "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for isotope instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'isotope' );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init( callback );
        } else {
          // initialize new instance
          $.data( this, 'isotope', new $.Isotope( options, this, callback ) );
        }
      });
    }
    // return jQuery object
    // so plugin methods do not have to
    return this;
  };

})( window, jQuery );
/*jslint white:false, onevar:true, undef:true, nomen:true, eqeqeq:true, plusplus:true, bitwise:true, regexp:true, newcap:true, immed:true, strict:false, browser:true */
/*global jQuery:false, document:false */
'use strict';

(function ($) {
    $(document).ready(function () {
        if ($('body').hasClass('lt-ie7')) {return; }
        // Application specific javascript code goes here
        // cache container
        var $container = $('#link-container');
        // initialize isotope
        $container.isotope({
          // options...
        });
        // filter items when filter link is clicked
        $('#filters a').click(function () {
            var selector = $(this).attr('data-filter');
            $container.isotope({ filter: selector });
            return false;
        });
    }
    );
}(jQuery));