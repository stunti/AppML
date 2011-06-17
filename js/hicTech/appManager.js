/*!
 * 
      _/_/_/_/                                      _/
     _/    _/  _/_/_/     _/_/_/   _/_/_/ _/_/_/   _/ 
    _/_/_/_/  _/    _/  _/    _/  _/    _/    _/  _/  
   _/    _/  _/    _/  _/    _/  _/    _/    _/  _/
  _/    _/  _/_/_/_/  _/_/_/_/  _/    _/    _/  _/
           _/        _/                                          
	      _/        _/
    						                 						                
    						                
 * appML v0.9 - rev.005
 * http:// appml.org
 *
 * Copyright 2011, hicTech srl www.hictech.com
 * licensed under the MIT
 *
 * Date: Feb 14th 2011
 * 
 * 
 * 
 * 
 * 
 * this file contains:
 * - jQTouch library Created by David Kaneda <http://www.davidkaneda.com>
 * - iScroll library Created by Matteo Spinelli <http://www.cubiq.org>
 * - appML library   Created by hicTech srl   <http://www.appml.org>
 */










/*

            _/    _/_/    _/_/_/_/_/                              _/       
               _/    _/      _/      _/_/    _/    _/    _/_/_/  _/_/_/    
          _/  _/    _/      _/    _/    _/  _/    _/  _/        _/    _/   
         _/  _/    _/      _/    _/    _/  _/    _/  _/        _/    _/    
        _/    _/_/  _/    _/      _/_/      _/_/_/    _/_/_/  _/    _/     
       _/                                                                  
    _/

    Created by David Kaneda <http://www.davidkaneda.com>
    Modified by hicTech srl
    Documentation and issue tracking on Google Code <http://code.google.com/p/jqtouch/>
    
    Special thanks to Jonathan Stark <http://jonathanstark.com/>
    and pinch/zoom <http://www.pinchzoom.com/>
    
    (c) 2009 by jQTouch project members.
    See LICENSE.txt for license.
    
    $Revision: 109 $
    $Date: 2009-10-06 12:23:30 -0400 (Tue, 06 Oct 2009) $
    $LastChangedBy: davidcolbykaneda $

*/

(function($) {


    $.jQTPanel = function($elem,_jQTSettings){
	
		var jQTSettings = _jQTSettings,
		    _this=this;
		this.currentPage=null;
		this.hist=[];    
		this.elem=$elem;
		 
		init();
	
		function init(){
		    
		    var $elem=_this.elem;
	
		    if (jQTSettings.fullScreenClass && window.navigator.standalone == true) { // (jQTSettings.statusBar){         (jQTSettings.fullScreenClass && window.navigator.standalone == true) {
			$elem.addClass(jQTSettings.fullScreenClass + ' ' + jQTSettings.statusBar);
			}
	
		    // Make sure exactly one child of $elem has "current" class
		    if ($elem.find('.current').length == 0) {
			_this.currentPage = $elem.find('*:first');
		    } else {
			_this.currentPage = $elem.find('.current:first');
			$elem.find('.current').removeClass('current');
		    }
	
	
		    //addPageToHistory(_this.currentPage);    cioè:
		    var pageId = _this.currentPage.attr('id');
			var pageTitle = _this.currentPage.attr('data-title');
			
			if(pageTitle=="homeTitle")
				pageTitle=_this.currentPage.closest("[data-title]").attr("data-title");
			if(pageTitle==undefined)
				pageTitle="Back";
			    
				// Prepend info to page history
	            _this.hist.unshift({
	                page: _this.currentPage, 
	                id: pageId,
					title:pageTitle
	            });
	
		}
	
		this.getId =  function(){
		    return this.elem.attr("id");
		};

    };

    $.jQTouch = function(options) {
        
        // Set support values
        $.support.WebKitCSSMatrix = (typeof WebKitCSSMatrix == "object");
        $.support.touch = (typeof Touch == "object");
        $.support.WebKitAnimationEvent = (typeof WebKitTransitionEvent == "object");
	
        // Initialize internal variables
        var $body, 
            $head=$('head'), 
            hist=[], 
            jQTPanels=[],
            selectedPanel=null,
            newPageCount=0, 
            jQTSettings={}, 
            hashCheck, 
            currentPage, 
            orientation, 
            isMobileWebKit = RegExp(" Mobile/").test(navigator.userAgent), 
            tapReady=true,
            lastAnimationTime=0,
            touchSelectors=[],
            publicObj={},
            extensions=$.jQTouch.prototype.extensions,
            defaultAnimations=['slide','flip','slideup','swap','cube','pop','dissolve','fade'/*,'back'*/], 
            animations=[], 
            hairextensions='';
        var animation_in_progress=false;
        var current_hash="";

        var defaults = {
                addGlossToIcon: true,
                backSelector: '.back, .cancel, .goback',
                cacheGetRequests: true,
                cubeSelector: '.cube',
                dissolveSelector: '.dissolve',
                fadeSelector: '.fade',
                fixedViewport: true,
                flipSelector: '.flip',
                formSelector: 'form',
                fullScreen: true,
                fullScreenClass: 'fullscreen',
                icon: null,
                touchSelector: 'a, .touch',
                popSelector: '.pop',
                preloadImages: false,
                slideSelector: '.appML_div ul li a',
                slideupSelector: '.slideup',
                startupScreen: null,
                statusBar: 'default', // other options: black-translucent, black
                submitSelector: '.submit',
                swapSelector: '.swap',
                useAnimations: true,
                useFastTouch: true // Experimental.
            };
        jQTSettings = $.extend({}, defaults, options);
        
        
        
        function init() {
            
        	// Preload images
            if (jQTSettings.preloadImages) {
                for (var i = jQTSettings.preloadImages.length - 1; i >= 0; i--){
                    (new Image()).src = jQTSettings.preloadImages[i];
                };
            }
            // Set icon
            if (jQTSettings.icon) {
                var precomposed = (jQTSettings.addGlossToIcon) ? '' : '-precomposed';
                hairextensions += '<link rel="apple-touch-icon' + precomposed + '" href="' + jQTSettings.icon + '" />';
            }
            // Set startup screen
            if (jQTSettings.startupScreen) {
                hairextensions += '<link rel="apple-touch-startup-image" href="' + jQTSettings.startupScreen + '" />';
            }
            // Set viewport
            if (jQTSettings.fixedViewport) {
                hairextensions += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"/>';
            }
            // Set full-screen
            if (jQTSettings.fullScreen) {
                hairextensions += '<meta name="apple-mobile-web-app-capable" content="yes" />';
                if (jQTSettings.statusBar) {
                    hairextensions += '<meta name="apple-mobile-web-app-status-bar-style" content="' + jQTSettings.statusBar + '" />';
                }
            }
            if (hairextensions) $head.append(hairextensions);


		    // Public jQuery Fns
		    $.fn.unselect = function(obj) {
				if (obj) {
				    obj.removeClass('active');
				    obj.parents(".appML_section").find('.active').removeClass("active");
				} else {
				    $('.active').removeClass('active');
				}
		    };
		    $.fn.makeActive = function(){
		    	return $(this).addClass('active');
		    };
		    $.fn.swipe = function(fn) {
				if ($.isFunction(fn))
				{
				    return this.each(function(i, el){
					$(el).bind('swipe', fn);  
				    });
				}
		    };
		    $.fn.tap = function(fn){
				if ($.isFunction(fn))
				{
				    var tapEvent = (jQTSettings.useFastTouch && $.support.touch) ? 'tap' : 'click';
				    return $(this).live(tapEvent, fn);
				} else {
				    $(this).trigger('tap');
				}
		    };

            // Initialize on document load:
            $(document).ready(function(){

                // Add extensions
                for (var i in extensions)
                {
                    var fn = extensions[i];
                    if ($.isFunction(fn))
                    {
                        $.extend(publicObj, fn(publicObj));
                    }
                }
                
                // Add animations
                for (var i in defaultAnimations)
                {
                    var name = defaultAnimations[i];
                    var selector = jQTSettings[name + 'Selector'];
                    if (typeof(selector) == 'string') {
                        addAnimation({name:name, selector:selector});
                    }
                }

                touchSelectors.push('input');
                touchSelectors.push(jQTSettings.touchSelector);
                touchSelectors.push(jQTSettings.backSelector);
                touchSelectors.push(jQTSettings.submitSelector);
                $(touchSelectors.join(', ')).css('-webkit-touch-callout', 'none');
                $(jQTSettings.backSelector).tap(liveTap);
                $(jQTSettings.submitSelector).tap(submitParentForm);

                // Create custom live events
                $('.appML_div').submit(submitForm);
                if($.support.touch)
                	$('.appML_div')
                		.bind('touchstart', handleTouch)
                		.bind('tap', liveTap);
                else
                	$('*[data-href]').bind('click', liveTap); // desktop compatibility for [data-href] elements...
                
                $body =  $('.appML_panel');     //$('.appML_panel');     $('body');
                
				// Orientation change event bind to the body: $body is invoked in updateOrientation() for all the appML_panel elements...
		                
				$('body')
					/*.bind('touchstart', handleTouch)
	                .submit(submitForm)*/
			   		.bind('orientationchange', updateOrientation)
	                .trigger('orientationchange');

                if (jQTSettings.useFastTouch && $.support.touch)
                {
                    $body.click(function(e){
                    	
			            var $el = $(e.target);
			            
						if ($el.attr('target') == '_blank' || $el.attr('rel') == 'external' || $el.is('input')){
                            return true;
                        } 
						else{
							return false;
                        }
                    });
                    
                    // This additionally gets rid of form focusses
                    $body.mousedown(function(e){
                    	var timeDiff = (new Date()).getTime() - lastAnimationTime;
                        if (timeDiff < 200)
                        {
                            return false;
                        }
                    });
                }

				/* fabris:*/
				$panels = $('.appML_panel');
	            $panels.each(function(){
				    var panel=new $.jQTPanel($(this),jQTSettings);
				    jQTPanels.push(panel);
	            });

				if(jQTPanels.length>0){
				    setSelectedPanel(jQTPanels[0]);
				    // Go to the top of the "current" page
				    setHash($(selectedPanel.currentPage).attr('id'));
				    scrollTo(0, 0);                
				    //alert("started "+$(selectedPanel.currentPage).attr('id'));
				}
				
				//printState();
            });
        };
        
        // PUBLIC FUNCTIONS
        function goBack(to) {

            // Init the param
            if (hist.length > 1) {
                var numberOfPages = Math.min(parseInt(to || 1, 10), hist.length-1);

                // Search through the history for an ID
                if( isNaN(numberOfPages) && typeof(to) === "string" && to != '#' ) {
                    for( var i=1, length=hist.length; i < length; i++ ) {
                        if( '#' + hist[i].id === to ) {
                            numberOfPages = i;
                            break;
                        }
                    }
                }

                // If still nothing, assume one
                if( isNaN(numberOfPages) || numberOfPages < 1 ) {
                    numberOfPages = 1;
                };

                // Grab the current page for the "from" info
                var animation = hist[0].animation;
                var fromPage = hist[0].page;

                // Remove all pages in front of the target page
                spliceHistory(numberOfPages);

                // Grab the target page
                var toPage = hist[0].page;

                // Make the animations
                animatePages(fromPage, toPage, animation, true);
                return publicObj;
            } else {
                return false;
            }
        }
        function goTo(toPage, animation) {
            
        	var fromPage = hist[0].page;
            	
            if (typeof(toPage) === 'string') {
                toPage = $(toPage);
            }
            
            if(hist[0].id==toPage.attr("id")){
            	return false;
            }
            if(!appML.isInCurrentPanel(toPage.attr("id"))){
            	appML.goTo("#"+toPage.attr("id"));
            	return publicObj;
            }
            
            if (typeof(animation) === 'string') {
                for (var i = animations.length - 1; i >= 0; i--){
                    if (animations[i].name === animation)
                    {
                        animation = animations[i];
                        break;
                    }
                }
            }
            if (animatePages(fromPage, toPage, animation)) {
                addPageToHistory(toPage, animation);
                return publicObj;
            }
            else
            {
            	console.error('Could not animate pages.');
                return false;
            }
        }
        
        function getHash(){
        	return current_hash;//location.hash;
        }
        function setHash(hash){
        	current_hash = (hash.indexOf('#')==0) ? hash : "#"+hash;
        	/*$(".appml_root_div").attr("id",current_hash.substring(1,current_hash.length));
        	location.hash=current_hash;//"#appML_body_div";*/
        }
        
        
        function getOrientation() {
            return orientation;
        }

        // PRIVATE FUNCTIONS
        function liveTap(e){
            // Grab the clicked element
            var $el = $(e.target);
            
            if((!$el.is(jQTSettings.backSelector))){
	            if($el.attr("data-href")==null && $el.attr("href")==null){
	            	// find the right element..
	            	if($el.parents("[data-href]").length>0)
	                	$el = $el.parents("[data-href]");
	            	else if($el.parents("[href]").length>0)
	            		$el = $el.parents("[href]");
	            	else if($el.attr('nodeName')!=='A')
	            		$el = $el.parents('a');
	            }
            }
            
            // Figure out the animation to use
            for (var i = animations.length - 1; i >= 0; i--){
            	if ($el.is(animations[i].selector)) {
                    animation = animations[i];
                    break;
                }
            };
            
            if((!$el.is(jQTSettings.backSelector))){
	            var data_href=$el.attr("data-href");
	            if(data_href==null)
	           		data_href=$el.attr("href");
	            
	            if(data_href!=null && data_href.indexOf("#")==0 && data_href.length>1){
	            	$.fn.unselect($el);
	            	$el.addClass('active');
	            	appML.goTo(data_href,animation);
	            	return false;
	            }
            }
	            
            var target = $el.attr('target'), 
            hash = $el.attr('hash'), 
            animation=null;
            
            if (tapReady == false || !$el.length) {
                console.warn('Not able to tap element.');
                return false;
            }
            
            if ($el.attr('target') == '_blank' || $el.attr('rel') == 'external')
            {
                return true;
            }
            
            // User clicked an internal link, fullscreen mode
            if (target == '_webapp') {
            	window.location = $el.attr('href');
            }
            // User clicked a back button
            else if ($el.is(jQTSettings.backSelector)) {
            	$.fn.unselect($el);
                goBack(hash);
            }
            // Branch on internal or external href
            else if (hash && hash!='#') {
                var href_el=$(hash).data('referrer', $el);
                if(goTo(href_el, animation)!=false)
                	$el.addClass('active');
                else
                	$.fn.unselect();
            } else {
                $el.addClass('loading active');
                showPageByHref($el.attr('href'), {
                    animation: animation,
                    callback: function(){ 
                        $el.removeClass('loading'); setTimeout($.fn.unselect, 250, $el);
                    },
                    $referrer: $el,
                    converter:$el.attr('data-converter')
                });
            }
            return false;
        }

		// fabris:
		function addPageToHistory(page, animation) {
            // Grab some info
            var pageId = page.attr('id');
			var pageTitle = page.attr('data-appml-title');
			if(pageTitle=="homeTitle")
				pageTitle=_this.currentPage.closest("data-appml-title").attr("data-appml-title");
			if(pageTitle==undefined)
				pageTitle="Back";

            // Prepend info to page history
            hist.unshift({
                page: page, 
                animation: animation, 
                id: pageId,
				title:pageTitle
            });
            refreshSelectedPanel();
        }

		function spliceHistory(numberOfPages){
		    hist.splice(0, numberOfPages);
		    refreshSelectedPanel();
		}
	
		function setCurrentPage(_currentPage){
		    currentPage = _currentPage;
		    refreshSelectedPanel();
		}
	
		function setSelectedPanel(selected_panel){
	
		    if(animation_in_progress)
			setTimeout(setSelectedPanel(selected_panel),200);
		    else{
				$(currentPage).removeClass('current');
				
				selectedPanel = (typeof(selected_panel) === 'string') ? getJQTPanel(selected_panel) : selected_panel;
				adjustToSelectedPanel();
				//printState();
		
				$(currentPage).addClass('current');
				changedView(false,true);
		    }	
		}
	
		function refreshSelectedPanel(){
		    selectedPanel.currentPage=currentPage;
		    selectedPanel.hist=hist; 
		}
		
		function adjustToSelectedPanel(){
		    currentPage = selectedPanel.currentPage;
		    hist=selectedPanel.hist;
		}
	
		function getJQTPanel(panel_id){
		    for(i=0;i<jQTPanels.length;i++){
			if(jQTPanels[i].getId()==panel_id){
			    return jQTPanels[i];
			}
		    }
		    return null;
		}
	
		function printState(){
	 	    var len=jQTPanels.length;
		    console.log("jQTouch state: "+jQTPanels.length+" panels, selected: "+selectedPanel.getId()+", state: "+getState());
		    console.log("\nPanels{\n");
		    var i=0;
		    for(i=0;i<len;i++){
			console.log("    "+getState(jQTPanels[i]));
		    }
		    console.log("}\n\n");
		}
	
		function getState(panel){
		    var pan_id = (panel!=null) ? "Panel "+panel.getId()+": " : "";
		    var _current = (panel!=null) ? panel.currentPage : currentPage; 
		    var _hist = (panel!=null) ? panel.hist : hist;
		    var ret=pan_id+"[ currentPage: "+_current.attr("id");
		    ret+=", hist("+_hist.length+"): {";
		    for(i=0;i<_hist.length;i++)
			ret+=" "+_hist[i].id+" ";
		    ret+="} ]";
		    return ret;
		}
	
		
		
		function changedView(backwards,cangedPanel){
			if(cangedPanel || backwards){
					if(hist[1]) {
						setBackButtonText(hist[1].title);
						return;
					}
				else{
					setBackButtonText(false);
					return;
				}
			}
			if(!backwards){
				setBackButtonText(hist[0].title);
				return false;
			}
		}

		function setBackButtonText(text){
			if(!text)
				setTimeout(function(){$(".back").css("opacity","0")},50);
			else{
            	setTimeout(function(){$(".back").css("opacity","1");$(".back").text(text);$(".back").show();},50);
			}
		}
	
        function animatePages(fromPage, toPage, animation, backwards) {
        	// Error check for target page
        	if(toPage.length === 0){
                $.fn.unselect();
                console.error('Target element is missing.');
                return false;
            }
            
		    animation_in_progress=true;
			
			changedView(backwards);
			
		    $(".appML_panel input").attr('readonly', true);
			
		    //$(toPage).html($(toPage).html()+"<input type='text' style='opacity:0; position:absolute; top:10px; left:10px' id='escapeInput' readonly />");
		    setTimeout(function(){$(fromPage).css("opacity","0"); setTimeout(function(){$(fromPage).css("opacity","1");},400);},350);
		    
			    
		    // Collapse the keyboard
            $(':focus').blur();

            // Make sure we are scrolled up to hide location bar
            // scrollTo(0, 0);
            
            // Define callback to run after animation completes
		    var callback = function(event){
				
				$(".appML_panel input").attr('readonly', false);
				
				fromPage.removeClass('current');
	
	            toPage.trigger('pageAnimationEnd', { direction: 'in' });
		        fromPage.trigger('pageAnimationEnd', { direction: 'out' });
	            
	            setCurrentPage(toPage);
	            setHash(currentPage.attr('id'));
	            
	            var $originallink = toPage.data('referrer');
	            if ($originallink) {
	                $originallink.unselect();
	            }
	            lastAnimationTime = (new Date()).getTime();
	            tapReady = true;
	            animation_in_progress=false;
	            
	            //appML.adjustToScreen();
	        };
		    
		    appML.animatePages(fromPage, toPage, animation, backwards);
		    
            fromPage.trigger('pageAnimationStart', { direction: 'out' });
            toPage.trigger('pageAnimationStart', { direction: 'in' });

            if ($.support.WebKitAnimationEvent && animation && jQTSettings.useAnimations) {
                toPage.one('appMLAnimationEnd', callback);
                tapReady = false;
                toPage.addClass('current');
            } else {
                toPage.addClass('current');
                callback();
            }
	        return true;
        }
        
        function animatePagesjQT(fromPage, toPage, animation, backwards){
        	
        	// Define callback to run after animation completes
		    var callback = function(event){
				
				if (animation)
	            {
	                toPage.removeClass('in reverse ' + animation.name);
	                fromPage.removeClass('out reverse ' + animation.name);
	            }
				$(toPage).trigger('appMLAnimationEnd');
		    };
		    
		    if ($.support.WebKitAnimationEvent && animation && jQTSettings.useAnimations){
		    	toPage.one('webkitAnimationEnd', callback);
		    	toPage.addClass(animation.name + ' in ' + (backwards ? ' reverse' : ''));
                fromPage.addClass(animation.name + ' out' + (backwards ? ' reverse' : ''));
            }
		    else
		    	callback();
        }
        


        function insertPages(nodes, animation) {
            var targetPage = null;
            $(nodes).each(function(index, node){
            	var $node = $(this);
                if (!$node.attr('id')) {
                    $node.attr('id', 'page-' + (++newPageCount));
                }
                $node.appendTo(selectedPanel.elem);
                if ($node.hasClass('current') || !targetPage ) {
                    targetPage = $node;
                }
            });

            if (targetPage !== null) {
                goTo(targetPage, "slide");
                return targetPage;
            }
            else
            {
                return false;
            }
        }

        function showPageByHref(href, options) {
            var defaults = {
                data: null,
                method: 'GET',
                animation: "slide",
                callback: null,
                $referrer: null,
                converter: null
            };
            
            var settings = $.extend({}, defaults, options);

            if (href != '#')
            {
            appML.appManagerShowLoading();
                $.ajax({
                    url: href,
                    data: settings.data,
                    type: settings.method,
                    success: function (data, textStatus) {
                appML.appManagerHideLoading();
                        var firstPage = insertPages(data, settings.animation);
                        if (firstPage)
                        {
                            if (settings.method == 'GET' && jQTSettings.cacheGetRequests && settings.$referrer)
                            {
                                settings.$referrer.attr('href', '#' + firstPage.attr('id'));
                            }
                            if (settings.callback) {
                                settings.callback(true);
                   
                            }
                        }
                    },
                    error: function (data) {
                    appML.appManagerShowDialog({message:"<div style='text-align:center'>Problems occurred while connecting to url:<br> <b>"+href+"</b></div>"});
                        if (settings.$referrer) 
                        settings.$referrer.unselect();
                        if (settings.callback) {
                            settings.callback(false);
                        }
                    }
                });
            }
            else if (settings.$referrer)
            {
            settings.$referrer.unselect();
            }

        }
        function submitForm(e, callback){
            var $form = (typeof(e)==='string') ? $(e) : $(e.target);

            if ($form.length && $form.is(jQTSettings.formSelector) && $form.attr('action')) {
                showPageByHref($form.attr('action'), {
                    data: $form.serialize(),
                    method: $form.attr('method') || "POST",
                    animation: animations[0] || null,
                    callback: callback
                });
                return false;
            }
            return true;
        }
        function submitParentForm(e){
            var $form = $(this).closest('form');
            if ($form.length)
            {
                evt = jQuery.Event("submit");
                evt.preventDefault();
                $form.trigger(evt);
                return false;
            }
            return true;
        }
        function addAnimation(animation) {
            if (typeof(animation.selector) == 'string' && typeof(animation.name) == 'string') {
                animations.push(animation);
                $(animation.selector).tap(liveTap);
                touchSelectors.push(animation.selector);
            }
        }
        function updateOrientation() {
            orientation = window.innerWidth < window.innerHeight ? 'profile' : 'landscape';
            $body.removeClass('profile landscape').addClass(orientation).trigger('turn', {orientation: orientation});
            // scrollTo(0, 0);
        }
        function handleTouch(e) {

        	var $el = $(e.target);
            
            // Only handle touchSelectors
            if (!$el.is(touchSelectors.join(', ')))
            {
                var $link = $el.closest('a');
                
                if ($link.length){
                    $el = $link;
                } else {
                	var data_href=$el.attr("data-href");
                	if(data_href==null){
                		var el_parents=$el.parents("[data-href]");
                		if(el_parents.length>0)
                			$el=el_parents;
                		else
                			return true;
                	}
                }
            } 
            if (event)
            {
                var hoverTimeout = null,
                    startX = event.changedTouches[0].clientX,
                    startY = event.changedTouches[0].clientY,
                    startTime = (new Date).getTime(),
                    deltaX = 0,
                    deltaY = 0,
                    deltaT = 0;

                // Let's bind these after the fact, so we can keep some internal values
                $el.bind('touchmove', touchmove).bind('touchend', touchend);

                hoverTimeout = setTimeout(function(){
                    $el.makeActive();
                }, 100);
                
            }

            // Private touch functions (TODO: insert dirty joke)
            function touchmove(e) {
                
                updateChanges();
                var absX = Math.abs(deltaX);
                var absY = Math.abs(deltaY);
                                
                // Check for swipe
                if (absX > absY && (absX > 35) && deltaT < 1000) {
                    $el.trigger('swipe', {direction: (deltaX < 0) ? 'left' : 'right'}).unbind('touchmove touchend');
                } else if (absY > 1) {
                    $el.removeClass('active');
                }

                clearTimeout(hoverTimeout);
            } 
            
            function touchend(){
                updateChanges();
            
                if (deltaY === 0 && deltaX === 0) {
                    $el.makeActive();
                    
                    $el.trigger('tap');
                } else {
                    $el.removeClass('active');
                }
                $el.unbind('touchmove touchend');
                clearTimeout(hoverTimeout);
            }
            
            function updateChanges(){
                var first = event.changedTouches[0] || null;
                deltaX = first.pageX - startX;
                deltaY = first.pageY - startY;
                deltaT = (new Date).getTime() - startTime;
            }
            
            return true;
        } // End touch handler

        function handleClick(e){
        	var $el = $(e.target);
            
        	//data-href attributes are like A and can refer to pages in different panels from the current (appML)
            var data_href=$el.attr("data-href");
            if(data_href==null && $el.parents("[data-href]").length>0)
            	data_href = $el.parents("[data-href]").attr("data-href");
            if(data_href!=null){
            	appML.goTo(data_href);
            	return false;
            }
            return true;
        }
        
        
        publicObj = {
            getOrientation: getOrientation,
            goBack: goBack,
            goTo: goTo,
            addAnimation: addAnimation,
            submitForm: submitForm,
		    setSelectedPanel: setSelectedPanel,
		    printState: printState,
		    getJQTPanel: getJQTPanel,
		    animate: animatePagesjQT,
		    init: init
        };

        return publicObj;
    };
    
    // Extensions directly manipulate the jQTouch object, before it's initialized.
    $.jQTouch.prototype.extensions = [];
    $.jQTouch.addExtension = function(extension){
        $.jQTouch.prototype.extensions.push(extension);
    };

    var app_location = (location.href.indexOf('#')>0) ? location.href.substring(0,location.href.lastIndexOf('#')) : location.href;
    $.jQTouch.prototype.app_location = app_location;    

})(jQuery);




/*!
 * 
            _/                                   _/  _/   
               _/_/_/  _/_/_/  _/ _/_/   _/_/   _/  _/
          _/  _/      _/      _/_/    _/   _/  _/  _/
         _/  _/_/_/  _/      _/      _/   _/  _/  _/
        _/      _/  _/      _/      _/   _/  _/  _/
       _/  _/_/_/  _/_/_/  _/       _/_/    _/  _/                       
	      

/**
 * 
 * Find more about the scrolling function at
 * http://cubiq.org/iscroll
 *
 * Copyright (c) 2010 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 * Version 3.7.1 - Last updated: 2010.10.08
 * 
 * Modified by hicTech srl
 */

(function($){

    // Is translate3d compatible?
    var has3d = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
    // Device sniffing
    var isIthing = (/iphone|ipad/gi).test(navigator.appVersion);
    var isTouch = ('ontouchstart' in window);
    // Event sniffing
    var START_EVENT = isTouch ? 'touchstart' : 'mousedown';
    var MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove';
    var END_EVENT = isTouch ? 'touchend' : 'mouseup';
    var RESIZE_EVENT= isTouch ? 'orientationchange' : 'resize';
    // Translate3d helper
    var translateOpen = 'translate' + (has3d ? '3d(' : '(');
    var translateClose = has3d ? ',0)' : ')';
    // Unique ID
    var uid = 0;

    $.iScroll = function (_element, options) {
	
		var $element = (typeof _element == 'string') ? $("#"+_element) : _element;
		var that = this, i;
		
		this.$elem = $element;
		this.element = $element[0];
		this.wrapper = this.element.parentNode;
		this.x=0;
		this.y=0;
		this.enabled=true;
		this.options={};
		this.onScrollEnd=null;
		this.wrapper_dims=null;
		this.elem_dims=null;
		
		this.handleEvent = function(e){
			switch (e.type) {
				case START_EVENT:
					that.touchStart(e);
					break;
				case MOVE_EVENT:
					that.touchMove(e);
					break;
				case END_EVENT:
					that.touchEnd(e);
					break;
				case 'webkitTransitionEnd':
					that.transitionEnd();
					break;
				case 'orientationchange':
				case 'resize':
					that.refresh();
					break;
				case 'DOMSubtreeModified':
					if(appML!=null)
						appML.iScrollDomModified($element);
					that.onDOMModified(e);
					break;
			}
			return true;
		};
		
		// Default options
	    var default_options={
		    bounce: has3d,
		    momentum: has3d,
		    checkDOMChanges: true,
		    topOnDOMChanges: false,
		    hScrollbar: has3d,
		    vScrollbar: has3d,
		    fadeScrollbar: isIthing || !isTouch,
		    shrinkScrollbar: isIthing || !isTouch,
		    desktopCompatibility: false,
		    overflow: 'auto',
		    snap: false,
		    bounceLock: false,
		    scrollbarColor: 'rgba(0,0,0,0.5)',
		    onScrollEnd: function () {},
		    doRefreshOnInit : true
	    };
	    this.options = $.extend({}, default_options, options);
	    
		this.init=function(){
		    that.element.style.webkitTransitionProperty = '-webkit-transform';
		    that.element.style.webkitTransitionTimingFunction = 'cubic-bezier(0,0,0.25,1)';
		    that.element.style.webkitTransitionDuration = '0';
		    that.element.style.webkitTransform = translateOpen + '0,0' + translateClose;
		    
	
		    if (that.options.desktopCompatibility) {
			    that.options.overflow = 'hidden';
		    }
		    
		    that.onScrollEnd = that.options.onScrollEnd;
		    delete that.options.onScrollEnd;
		    
		    that.wrapper.style.overflow = that.options.overflow;
		    
		    if(that.options.doRefreshOnInit)
		    	that.refresh();
		    
		    $(window).bind(RESIZE_EVENT,that.handleEvent);
		    //window.addEventListener(resize_event, that, false);
	
		    if (isTouch || that.options.desktopCompatibility) {
			    $element.bind(START_EVENT, that.handleEvent); 
			    //that.element.addEventListener(START_EVENT, that, false);
			    $element.bind(MOVE_EVENT,that.handleEvent); 
			    //that.element.addEventListener(MOVE_EVENT, that, false);
			    $element.bind(END_EVENT,that.handleEvent); 
			    //that.element.addEventListener(END_EVENT, that, false);
		    }
		    
		    if (that.options.checkDOMChanges) {
			    $element.bind('DOMSubtreeModified',that.handleEvent); 
			    //that.element.addEventListener('DOMSubtreeModified', that, false);
		    }
		    
		};
		
	};
	
	$.iScroll.prototype = {
	
		onDOMModified: function (e) {
			var that = this;
	
			// (Hopefully) execute onDOMModified only once
			if (e.target.parentNode != that.element) {
				return;
			}
	
			setTimeout(function () { that.refresh(); }, 0);
	
			if (that.options.topOnDOMChanges && (that.x!=0 || that.y!=0)) {
				that.scrollTo(0,0,'0');
			}
		},
		
		
		resizeInnerIScrollElement: function($elem) {
			var that = this;
			if($elem.is(".resizeWidth")){
				$elem.width(that.scrollWidth);
			}
			if($elem.children().length>0)
				$elem.children().each(function(){ that.resizeInnerIScrollElement($(this)); });
		},
		
		resizeInnerIScrollElements: function() {
			var that = this;
			that.$elem.children().each(function(){ that.resizeInnerIScrollElement($(this)); });
		},
		
		refreshHtmlElements: function() {
			var that = this;
			$(that.wrapper).width(that.scrollWidth);
			$(that.wrapper).height(that.scrollHeight);
			that.$elem.width(that.scrollerWidth);
			that.$elem.height(that.scrollerHeight);
			that.resizeInnerIScrollElements();
		},
		
		refresh: function () {
			var that = this,
				resetX = that.x, resetY = that.y,
				snap;
			
			if(that.wrapper_dims==null || that.wrapper_dims.landscape==null || that.elem_dims==null || that.elem_dims.landscape==null)
				return;
			
			that.scrollWidth = appML.landscapeScreen() ? that.wrapper_dims.landscape.width : that.wrapper_dims.portrait.width;
			that.scrollHeight = appML.landscapeScreen() ? that.wrapper_dims.landscape.height : that.wrapper_dims.portrait.height;
			that.scrollerWidth = appML.landscapeScreen() ? that.elem_dims.landscape.width : that.elem_dims.portrait.width;
			that.scrollerHeight = appML.landscapeScreen() ? that.elem_dims.landscape.height : that.elem_dims.portrait.height;
			that.maxScrollX = that.scrollWidth - that.scrollerWidth;
			that.maxScrollY = that.scrollHeight - that.scrollerHeight;
			that.directionX = 0;
			that.directionY = 0;
			
			that.refreshHtmlElements();
			
			//$(that.wrapper).width(that.scrollWidth);
			
			if (that.scrollX) {
				if (that.maxScrollX >= 0) {
					resetX = 0;
				} else if (that.x < that.maxScrollX) {
					resetX = that.maxScrollX;
				}
			}
			if (that.scrollY) {
				if (that.maxScrollY >= 0) {
					resetY = 0;
				} else if (that.y < that.maxScrollY) {
					resetY = that.maxScrollY;
				}
			}
	
			// Snap
			if (that.options.snap) {
				that.maxPageX = -Math.floor(that.maxScrollX/that.scrollWidth);
				that.maxPageY = -Math.floor(that.maxScrollY/that.scrollHeight);
	
				snap = that.snap(resetX, resetY);
				resetX = snap.x;
				resetY = snap.y;
			}
	
			if (resetX!=that.x || resetY!=that.y) {
				that.setTransitionTime('0');
				that.setPosition(resetX, resetY, true);
			}
			
			that.scrollX = that.scrollerWidth > that.scrollWidth;
			that.scrollY = !that.options.bounceLock && !that.scrollX || that.scrollerHeight > that.scrollHeight;
	
			// Update horizontal scrollbar
			if (that.options.hScrollbar && that.scrollX) {
				that.scrollBarX = that.scrollBarX || new scrollbar('horizontal', that.wrapper, that.options.fadeScrollbar, that.options.shrinkScrollbar, that.options.scrollbarColor);
				that.scrollBarX.init(that.scrollWidth, that.scrollerWidth);
			} else if (that.scrollBarX) {
				that.scrollBarX = that.scrollBarX.remove();
			}
	
			// Update vertical scrollbar
			if (that.options.vScrollbar && that.scrollY && that.scrollerHeight > that.scrollHeight) {
				that.scrollBarY = that.scrollBarY || new scrollbar('vertical', that.wrapper, that.options.fadeScrollbar, that.options.shrinkScrollbar, that.options.scrollbarColor);
				that.scrollBarY.init(that.scrollHeight, that.scrollerHeight);
			} else if (that.scrollBarY) {
				that.scrollBarY = that.scrollBarY.remove();
			}
		},
	
		setPosition: function (x, y, hideScrollBars) {
			var that = this;
			
			that.x = x;
			that.y = y;
	
			that.element.style.webkitTransform = translateOpen + that.x + 'px,' + that.y + 'px' + translateClose;
	
			// Move the scrollbars
			if (!hideScrollBars) {
				if (that.scrollBarX) {
					that.scrollBarX.setPosition(that.x);
				}
				if (that.scrollBarY) {
					that.scrollBarY.setPosition(that.y);
				}
			}
		},
		
		setTransitionTime: function(time) {
			var that = this;
			
			time = time || '0';
			that.element.style.webkitTransitionDuration = time;
			
			if (that.scrollBarX) {
				that.scrollBarX.bar.style.webkitTransitionDuration = time;
				that.scrollBarX.wrapper.style.webkitTransitionDuration = has3d && that.options.fadeScrollbar ? '300ms' : '0';
			}
			if (that.scrollBarY) {
				that.scrollBarY.bar.style.webkitTransitionDuration = time;
				that.scrollBarY.wrapper.style.webkitTransitionDuration = has3d && that.options.fadeScrollbar ? '300ms' : '0';
			}
		},
			
		touchStart: function(e) {
			var that = this,
				matrix;
			
			if (!that.enabled) {
				return;
			}
			
			var $el = $(e.target);
			//if($el.parents(".iscroll").length==0){
				if(!($el.is(".input_filter")))  
					e.preventDefault(); 
				//e.stopPropagation();
			//}
			
		
			
			that.scrolling = true;		// This is probably not needed, but may be useful if iScroll is used in conjuction with other frameworks
	
			that.moved = false;
			that.distX = 0;
			that.distY = 0;
	
			that.setTransitionTime('0');
	
			// Check if the scroller is really where it should be
			if (that.options.momentum || that.options.snap) {
				matrix = new WebKitCSSMatrix(window.getComputedStyle(that.element).webkitTransform);
				if (matrix.e != that.x || matrix.f != that.y) {
					$(document).unbind('webkitTransitionEnd',that.handleEvent);
					//document.removeEventListener('webkitTransitionEnd', that, false);
					that.setPosition(matrix.e, matrix.f);
					that.moved = true;
				}
			}
	
			that.touchStartX = isTouch ? e.changedTouches[0].pageX : e.pageX;
			that.scrollStartX = that.x;
	
			that.touchStartY = isTouch ? e.changedTouches[0].pageY : e.pageY;
			that.scrollStartY = that.y;
	
			that.scrollStartTime = e.timeStamp;
	
			that.directionX = 0;
			that.directionY = 0;
			
			point = isTouch ? e.changedTouches[0] : e;
			appML.manageTouchStart(that,point,e.timeStamp);
		},
		
		touchMove: function(e) {		
			if (!this.scrolling) {
				return;
			}
	
			var that = this,
				pageX = isTouch ? e.changedTouches[0].pageX : e.pageX,
				pageY = isTouch ? e.changedTouches[0].pageY : e.pageY;
			
			//var $el = $(e.target);
			//if($el.parents(".iscroll").length==0){
				e.preventDefault();
				e.stopPropagation();	// Stopping propagation just saves some cpu cycles (I presume)
			//}
			
			that.manageMove(pageX, pageY);
		},
		
		manageMove: function(pageX, pageY){
			var that = this,
				misured_leftDelta = pageX - that.touchStartX,
				misured_topDelta = pageY - that.touchStartY,
				leftDelta = (that.scrollX && pageX!=null) ? misured_leftDelta : 0,
				topDelta = (that.scrollY && pageY!=null) ? misured_topDelta : 0,
				newX = that.x + leftDelta,
				newY = that.y + topDelta;
	
			that.touchStartX = pageX;
			that.touchStartY = pageY;
	
			
			var threshold=2;
			var pass_x = (that.scrollX || (that.scrollY && Math.abs(misured_topDelta)>threshold)) ? null : pageX;
			var pass_y = (that.scrollY || (that.scrollX && Math.abs(misured_leftDelta)>threshold)) ? null : pageY;
			if(pass_x!=null || pass_y!=null){
				appML.manageParentMove(that, pass_x, pass_y);
			}
			else{
				
				// Slow down if outside of the boundaries
				if (newX >= 0 || newX < that.maxScrollX) {
					newX = that.options.bounce ? Math.round(that.x + leftDelta / 3) : (newX >= 0 || that.maxScrollX>=0) ? 0 : that.maxScrollX;
				}
				if (newY >= 0 || newY < that.maxScrollY) { 
					newY = that.options.bounce ? Math.round(that.y + topDelta / 3) : (newY >= 0 || that.maxScrollY>=0) ? 0 : that.maxScrollY;
				}
		
				if (that.distX + that.distY > 5) {			// 5 pixels threshold
		
					// Lock scroll direction
					if (that.distX-3 > that.distY) {
						newY = that.y;
						topDelta = 0;
					} else if (that.distY-3 > that.distX) {
						newX = that.x;
						leftDelta = 0;
					}
		
					that.setPosition(newX, newY);
					that.moved = true;
					that.directionX = leftDelta > 0 ? -1 : 1;
					that.directionY = topDelta > 0 ? -1 : 1;
				} else {
					that.distX+= Math.abs(leftDelta);
					that.distY+= Math.abs(topDelta);
					//that.dist+= Math.abs(leftDelta) + Math.abs(topDelta);
				}
			}
		},
		
		touchEnd: function(e) {
			if (!this.scrolling) {
				return;
			}
	
			var that = this,
				point = isTouch ? e.changedTouches[0] : e;
			
			that.manageEnd(point, e.timeStamp, null, e);
			return;
		},
		
		manageEnd: function (point, timestamp, touched_iScroll_id, e){
			if (!this.scrolling) {
				return;
			}
			var is_parent = (touched_iScroll_id!=null) ? (this.$elem.attr("id")==touched_iScroll_id || this.$elem.parents("[id='"+touched_iScroll_id+"']").length>0 || this.$elem.find("[id='"+touched_iScroll_id+"']").length>0) : false;
			if(is_parent)
				return;
			
			var that = this,
				time = timestamp - that.scrollStartTime,
				target, ev,
				momentumX, momentumY,
				newDuration = 0,
				newPositionX = that.x, newPositionY = that.y,
				snap;
	
			that.scrolling = false;
	
			if (!that.moved) {
				that.resetPosition();
	
				if (isTouch) {
					// Find the last touched element
					target = point.target;
					while (target.nodeType != 1) {
						target = target.parentNode;
					}
	
					
					// Create the fake event
					ev=new jQuery.Event("click");
					ev.bubbles=true; ev.cancelable = (e ? e.cancelable : true); ev.view = (e ? e.view : null); ev.detail=1; 
					ev.screenX=point.screenX; ev.screenY=point.screenY; ev.clientX=point.clientX; ev.clientY=point.clientY; 
					ev.ctrlKey = (e ? e.ctrlKey : null); ev.altKey = (e ? e.altKey : null); ev.shiftKey = (e ? e.shiftKey : null); 
					ev.metaKey = (e ? e.metaKey : null); ev.button=0; ev.relatedTarget=null; ev._fake=true;
					$(target).trigger(ev);
				}
	
				return;
			}
	
			if (!that.options.snap && time > 250) {			// Prevent slingshot effect
				that.resetPosition();
				return;
			}
	
			if (that.options.momentum) {
				momentumX = that.scrollX === true
					? that.momentum(that.x - that.scrollStartX,
									time,
									that.options.bounce ? -that.x + that.scrollWidth/5 : -that.x,
									that.options.bounce ? that.x + that.scrollerWidth - that.scrollWidth + that.scrollWidth/5 : that.x + that.scrollerWidth - that.scrollWidth)
					: { dist: 0, time: 0 };
	
				momentumY = that.scrollY === true
					? that.momentum(that.y - that.scrollStartY,
									time,
									that.options.bounce ? -that.y + that.scrollHeight/5 : -that.y,
									that.options.bounce ? (that.maxScrollY < 0 ? that.y + that.scrollerHeight - that.scrollHeight : 0) + that.scrollHeight/5 : that.y + that.scrollerHeight - that.scrollHeight)
					: { dist: 0, time: 0 };
	
				newDuration = Math.max(Math.max(momentumX.time, momentumY.time), 1);		// The minimum animation length must be 1ms
				newPositionX = that.x + momentumX.dist;
				newPositionY = that.y + momentumY.dist;
			}
	
			if (that.options.snap) {
				snap = that.snap(newPositionX, newPositionY);
				newPositionX = snap.x;
				newPositionY = snap.y;
				newDuration = Math.max(snap.time, newDuration);
			}
	
			that.scrollTo(newPositionX, newPositionY, newDuration + 'ms');
		},
	
		transitionEnd: function () {
			var that = this;
			$(document).unbind('webkitTransitionEnd',that.handleEvent);
			//document.removeEventListener('webkitTransitionEnd', that, false);
			that.resetPosition();
		},
	
		resetPosition: function () {
			var that = this,
				resetX = that.x,
			 	resetY = that.y;
	
			if (that.x >= 0) {
				resetX = 0;
			} else if (that.x < that.maxScrollX) {
				resetX = that.maxScrollX;
			}
	
			if (that.y >= 0 || that.maxScrollY > 0) {
				resetY = 0;
			} else if (that.y < that.maxScrollY) {
				resetY = that.maxScrollY;
			}
			
			if (resetX != that.x || resetY != that.y) {
				that.scrollTo(resetX, resetY);
			} else {
				if (that.moved) {
					that.onScrollEnd();		// Execute custom code on scroll end
					that.moved = false;
				}
	
				// Hide the scrollbars
				if (that.scrollBarX) {
					that.scrollBarX.hide();
				}
				if (that.scrollBarY) {
					that.scrollBarY.hide();
				}
			}
		},
		
		snap: function (x, y) {
			var that = this, time;
	
			if (that.directionX > 0) {
				x = Math.floor(x/that.scrollWidth);
			} else if (that.directionX < 0) {
				x = Math.ceil(x/that.scrollWidth);
			} else {
				x = Math.round(x/that.scrollWidth);
			}
			that.pageX = -x;
			x = x * that.scrollWidth;
			if (x > 0) {
				x = that.pageX = 0;
			} else if (x < that.maxScrollX) {
				that.pageX = that.maxPageX;
				x = that.maxScrollX;
			}
	
			if (that.directionY > 0) {
				y = Math.floor(y/that.scrollHeight);
			} else if (that.directionY < 0) {
				y = Math.ceil(y/that.scrollHeight);
			} else {
				y = Math.round(y/that.scrollHeight);
			}
			that.pageY = -y;
			y = y * that.scrollHeight;
			if (y > 0) {
				y = that.pageY = 0;
			} else if (y < that.maxScrollY) {
				that.pageY = that.maxPageY;
				y = that.maxScrollY;
			}
	
			// Snap with constant speed (proportional duration)
			time = Math.round(Math.max(
					Math.abs(that.x - x) / that.scrollWidth * 500,
					Math.abs(that.y - y) / that.scrollHeight * 500
				));
				
			return { x: x, y: y, time: time };
		},
	
		scrollTo: function (destX, destY, runtime) {
			var that = this;
	
			if (that.x == destX && that.y == destY) {
				that.resetPosition();
				return;
			}
	
			that.moved = true;
			that.setTransitionTime(runtime || '350ms');
			that.setPosition(destX, destY);
	
			if (runtime==='0' || runtime=='0s' || runtime=='0ms') {
				that.resetPosition();
			} else {
				$(document).bind('webkitTransitionEnd',that.handleEvent);
				//document.addEventListener('webkitTransitionEnd', that, false);	// At the end of the transition check if we are still inside of the boundaries
			}
		},
		
		scrollToPage: function (pageX, pageY, runtime) {
			var that = this, snap;
	
			if (!that.options.snap) {
				that.pageX = -Math.round(that.x / that.scrollWidth);
				that.pageY = -Math.round(that.y / that.scrollHeight);
			}
	
			if (pageX == 'next') {
				pageX = ++that.pageX;
			} else if (pageX == 'prev') {
				pageX = --that.pageX;
			}
	
			if (pageY == 'next') {
				pageY = ++that.pageY;
			} else if (pageY == 'prev') {
				pageY = --that.pageY;
			}
	
			pageX = -pageX*that.scrollWidth;
			pageY = -pageY*that.scrollHeight;
	
			snap = that.snap(pageX, pageY);
			pageX = snap.x;
			pageY = snap.y;
	
			that.scrollTo(pageX, pageY, runtime || '500ms');
		},
	
		scrollToElement: function (el, runtime) {
			el = typeof el == 'object' ? el : this.element.querySelector(el);
	
			if (!el) {
				return;
			}
	
			var that = this,
				x = that.scrollX ? -el.offsetLeft : 0,
				y = that.scrollY ? -el.offsetTop : 0;
	
			if (x >= 0) {
				x = 0;
			} else if (x < that.maxScrollX) {
				x = that.maxScrollX;
			}
	
			if (y >= 0) {
				y = 0;
			} else if (y < that.maxScrollY) {
				y = that.maxScrollY;
			}
	
			that.scrollTo(x, y, runtime);
		},
	
		momentum: function (dist, time, maxDistUpper, maxDistLower) {
			var friction = 2.5,
				deceleration = 1.2,
				speed = Math.abs(dist) / time * 1000,
				newDist = speed * speed / friction / 1000,
				newTime = 0;
	
			// Proportinally reduce speed if we are outside of the boundaries 
			if (dist > 0 && newDist > maxDistUpper) {
				speed = speed * maxDistUpper / newDist / friction;
				newDist = maxDistUpper;
			} else if (dist < 0 && newDist > maxDistLower) {
				speed = speed * maxDistLower / newDist / friction;
				newDist = maxDistLower;
			}
			
			newDist = newDist * (dist < 0 ? -1 : 1);
			newTime = speed / deceleration;
	
			return { dist: Math.round(newDist), time: Math.round(newTime) };
		},
		
		destroy: function (full) {
			var that = this;
			
			$(window).unbind(RESIZE_EVENT,that.handleEvent);
			//window.removeEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', that, false);		
			that.$elem.unbind(START_EVENT,that.handleEvent);
			//that.element.removeEventListener(START_EVENT, that, false);
			that.$elem.unbind(MOVE_EVENT,that.handleEvent);
			//that.element.removeEventListener(MOVE_EVENT, that, false);
			that.$elem.unbind(END_EVENT,that.handleEvent);
			//that.element.removeEventListener(END_EVENT, that, false);
			$(document).unbind('webkitTransitionEnd',that.handleEvent);
			//document.removeEventListener('webkitTransitionEnd', that, false);
	
			if (that.options.checkDOMChanges) {
				that.$elem.unbind('DOMSubtreeModified',that.handleEvent);
				//that.element.removeEventListener('DOMSubtreeModified', that, false);
			}
	
			if (that.scrollBarX) {
				that.scrollBarX = that.scrollBarX.remove();
			}
	
			if (that.scrollBarY) {
				that.scrollBarY = that.scrollBarY.remove();
			}
			
			if (full) {
				that.wrapper.parentNode.removeChild(that.wrapper);
			}
			
			return null;
		}
	};

	function scrollbar (dir, wrapper, fade, shrink, color) {
		var that = this,
			doc = document;
		
		that.dir = dir;
		that.fade = fade;
		that.shrink = shrink;
		that.uid = ++uid;
	
		// Create main scrollbar
		that.bar = doc.createElement('div');
	
		that.bar.style.cssText = 'position:absolute;top:0;left:0;-webkit-transition-timing-function:cubic-bezier(0,0,0.25,1);pointer-events:none;-webkit-transition-duration:0;-webkit-transition-delay:0;-webkit-transition-property:-webkit-transform;z-index:10;background:' + color + ';' +
			'-webkit-transform:' + translateOpen + '0,0' + translateClose + ';' +
			(dir == 'horizontal' ? '-webkit-border-radius:3px 2px;min-width:6px;min-height:5px' : '-webkit-border-radius:2px 3px;min-width:5px;min-height:6px');
	
		// Create scrollbar wrapper
		that.wrapper = doc.createElement('div');
		that.wrapper.style.cssText = '-webkit-mask:-webkit-canvas(scrollbar' + that.uid + that.dir + ');position:absolute;z-index:10;pointer-events:none;overflow:hidden;opacity:0;-webkit-transition-duration:' + (fade ? '300ms' : '0') + ';-webkit-transition-delay:0;-webkit-transition-property:opacity;' +
			(that.dir == 'horizontal' ? 'bottom:2px;left:2px;right:7px;height:5px' : 'top:2px;right:2px;bottom:7px;width:5px;');
	
		// Add scrollbar to the DOM
		that.wrapper.appendChild(that.bar);
		wrapper.appendChild(that.wrapper);
	}
	
	scrollbar.prototype = {
		init: function (scroll, size) {
			var that = this,
				doc = document,
				pi = Math.PI,
				ctx;
	
			// Create scrollbar mask
			if (that.dir == 'horizontal') {
				if (that.maxSize != that.wrapper.offsetWidth) {
					that.maxSize = that.wrapper.offsetWidth;
					ctx = doc.getCSSCanvasContext("2d", "scrollbar" + that.uid + that.dir, that.maxSize, 5);
					ctx.fillStyle = "rgb(0,0,0)";
					ctx.beginPath();
					ctx.arc(2.5, 2.5, 2.5, pi/2, -pi/2, false);
					ctx.lineTo(that.maxSize-2.5, 0);
					ctx.arc(that.maxSize-2.5, 2.5, 2.5, -pi/2, pi/2, false);
					ctx.closePath();
					ctx.fill();
				}
			} else {
				if (that.maxSize != that.wrapper.offsetHeight) {
					that.maxSize = that.wrapper.offsetHeight;
					ctx = doc.getCSSCanvasContext("2d", "scrollbar" + that.uid + that.dir, 5, that.maxSize);
					ctx.fillStyle = "rgb(0,0,0)";
					ctx.beginPath();
					ctx.arc(2.5, 2.5, 2.5, pi, 0, false);
					ctx.lineTo(5, that.maxSize-2.5);
					ctx.arc(2.5, that.maxSize-2.5, 2.5, 0, pi, false);
					ctx.closePath();
					ctx.fill();
				}
			}
	
			that.size = Math.max(Math.round(that.maxSize * that.maxSize / size), 6);
			that.maxScroll = that.maxSize - that.size;
			that.toWrapperProp = that.maxScroll / (scroll - size);
			that.bar.style[that.dir == 'horizontal' ? 'width' : 'height'] = that.size + 'px';
		},
		
		setPosition: function (pos) {
			var that = this;
			
			if (that.wrapper.style.opacity != '1') {
				that.show();
			}
	
			pos = Math.round(that.toWrapperProp * pos);
	
			if (pos < 0) {
				pos = that.shrink ? pos + pos*3 : 0;
				if (that.size + pos < 7) {
					pos = -that.size + 6;
				}
			} else if (pos > that.maxScroll) {
				pos = that.shrink ? pos + (pos-that.maxScroll)*3 : that.maxScroll;
				if (that.size + that.maxScroll - pos < 7) {
					pos = that.size + that.maxScroll - 6;
				}
			}
	
			pos = that.dir == 'horizontal'
				? translateOpen + pos + 'px,0' + translateClose
				: translateOpen + '0,' + pos + 'px' + translateClose;
	
			that.bar.style.webkitTransform = pos;
		},
	
		show: function () {
			if (has3d) {
				this.wrapper.style.webkitTransitionDelay = '0';
			}
			this.wrapper.style.opacity = '1';
		},
	
		hide: function () {
			if (has3d) {
				this.wrapper.style.webkitTransitionDelay = '350ms';
			}
			this.wrapper.style.opacity = '0';
		},
		
		remove: function () {
			this.wrapper.parentNode.removeChild(this.wrapper);
			return null;
		}
	};

})(jQuery);




/*!
 * 
      _/_/_/_/                                      _/
     _/    _/  _/_/_/     _/_/_/   _/_/_/ _/_/_/   _/ 
    _/_/_/_/  _/    _/  _/    _/  _/    _/    _/  _/  
   _/    _/  _/    _/  _/    _/  _/    _/    _/  _/
  _/    _/  _/_/_/_/  _/_/_/_/  _/    _/    _/  _/
           _/        _/                                          
	      _/        _/
    						                 						                
    						                
 * appML v0.9
 * http:// appml.org
 *
 * Copyright 2011, hicTech srl www.hictech.com
 * licensed under the MIT
 *
 * Date: Genuary 11st 2011
 */

/*$(document).ready(*/(function($){
	
	$.appManager = function(options){
		var settings = {
			selector                 : '#appML_content',
			transaction_duration     : 200,
			header                   : true,
			page_out_effect          : 'fade',    //blind, bounce, clip, explode, fold, highlight, puff, pulsate, scale, shake, size, slide
			page_in_effect           : 'fade',
			header_out_effect        : 'fade',    
			header_in_effect         : 'fade',
			between_effects_delay    : 300,
			start_page               : 0,
			menu_top_margin		     : 0,
			menu_left_margin         : 10,
			banner 				     : false,
			login                    : false,
			animation_replacements	 : {
				slide: "fade",
				flip: "fade",
				slideup: "fade",
				swap: "fade",
				cube: "fade",
				pop: "fade",
				dissolve: "fade",
				fade: "fade"
			},
			default_animation : "slide",
			async_sizing			 : true
		};
		
		this.setOptions = function(options){
			$.extend( true, settings, options );
		};
		
		if(options) 
			this.setOptions(options);
		
		var pages_number=0;
		var pages_array= new Array();
		var current_page=settings.start_page;
		var iScrolls=new Array();
		var max_id=0;
	    var overlay=false;
	    var appML_ready_fn="";
	    	
	    /*
		this.page_width=0;
		this.page_height=0;
		this.side_control_width=0;
		this.side_control_heigth=0;
		*/
	    this.dimensions=null; 
	    var scrollable_elems_to_compute=new Array();
		var elems_copies=new Array();
		
		
		function injectTitlePage(title,login,i){
			if($("#appML_navigation_bar").length>0 && $("#appML_navigation_bar").is(".appML_auto_fill")){
				var title_visibility="display:none";
				if(i==current_page)
					title_visibility="";
				if(login!=null)
					title="Login";
				$("#appML_navigation_bar").append($("<div style='position:relative'><div style='"+title_visibility+"'>"+title+"</div><div class='back'>Back</div></div>"));
			}
		}
		
		
		function isAppMLAutoFilled(elem_id){
			var $elem=$("#"+elem_id);
			return $elem.length>0 && $elem.is(".appML_auto_fill");
		}
		
		
		//MENU
		
		function injectMenuItems(title,icon,url,i){
			var width=100/pages_number;
			
			if($("style").html().indexOf('@import')==-1 || $("style").html().indexOf('/theme.css')==-1){
				alert("some unexpected string including theme.css... it must be like: @import 'themes/your_theme_folder/theme.css' ");
			}
			var toolbar_icon_path=$("style").html().replace('@import "','').replace('/theme.css";','');

			if(isAppMLAutoFilled("appML_toolbar")){
				var html_toolbar="<div class='appML_toolbar_content' data-href='"+url+"' style='width:"+width+"%'>"+					
									"<div class='appML_toolbar_icon'><img style='margin:2px 0px 0px 0px;' src='"+toolbar_icon_path+"/toolbar_icons/icons_off/"+icon+"' /></div>"+
									"<div class='appML_toolbar_label'><font>"+title+"</font></div>"+  
								"</div>";
				$("#appML_toolbar").append($(html_toolbar));
			}
			if(isAppMLAutoFilled("appML_left")){
				var html_sidebar="<div class='appML_sidebar_button'  data-href='"+url+"'>"+
									"<div class='appML_sidebar_background_icon'><div style='text-align:center;'><img src='"+toolbar_icon_path+"/toolbar_icons/icons_off/"+icon+"'  style='margin:9px 0px 0px 0px'></div></div>"+
									"<div class='appML_sidebar_label'>"+title+"</div>"+
								"</div>";	
				$("#appML_left").append($(html_sidebar));
			}
		}
		
		function setElementAsSelected(n){
			if(isAppMLAutoFilled("appML_toolbar")){
				$("#appML_toolbar").find("[data-href]").each(function(index){
					var node= $(this).find("img");
					var src = node.attr("src");
					if(index!=n){
						var	src = src.replace("icons_on","icons_off");
						node.attr("src",src);
					}
					else{
						var	src_s = src.replace("icons_off","icons_on");
						node.attr("src",src_s);
					}
				});
			}
			
			if(isAppMLAutoFilled("appML_left")){
				$("#appML_left").find("[data-href]").each(function(index){
					var node= $(this).find("img");
					var src = node.attr("src");
					if(index!=n){
						$(this).removeClass("appML_sidebar_button_on");
						if(src!=null){
							var src_s = src.replace("icons_on","icons_off");
							node.attr("src",src_s);
						}
					}
					else{
						$(this).addClass("appML_sidebar_button_on");
						if(src!=null){
							var	src_s = src.replace("icons_off","icons_on");
							node.attr("src",src_s);
						}
					}
				});
			}			
			
		}
		
		function getPanels(){
			var ret=new Array();
			for(i=0;i<pages_array.length;i++)
				ret.push(getNthPanel(i));
			return ret;
		}
		
		function getNthPanel(n){
			return pages_array[n].find("div > div");
		}
		
		function getCurrentPanel(){
			return getNthPanel(current_page);
		}
		
		function findPagePanelIndex(page_id){
			var url = (page_id.indexOf('#')==0) ? page_id : "#"+page_id;
			var panel=null;
			// find panel index
			for(i=0;i<pages_array.length;i++){
				panel=pages_array[i].find(url);
				if(panel!=null && panel.length>0)
					return i;
			}
		}
		
		function isPageInCurrentPanel(page_id){
			var url = (page_id.indexOf('#')==0) ? page_id : "#"+page_id;
			return pages_array[current_page].find(url).length>0;
		}
		
		function goNth(n){
			if(n!=current_page){
				var prev_page=$(".current").attr("id");
				setElementAsSelected(n);
				var id_pannello=getNthPanel(n).attr("id");
				jQT.setSelectedPanel(id_pannello);
				animatePanels(current_page,n);
				current_page=n;
			}
		}
		
		function goUrl(url,animation){
			if(url=="logout"){
				showDialog({
					message:"<div style='text-align:center'>Vuoi davvero uscire?</div>",
					type                   : "confirm",
					denyCallback		   : hideDialog,
					confirmCallback        : function(){document.location.href="index.html";}
				});
			}
			else{
				if(url.indexOf("#")==0){
					if(animation==null || animation.length==0)
						animation=settings.default_animation;
					var pos=findPagePanelIndex(url);
					if(pos>=0 && pos!=current_page){
						//alert("goToNth");
						goNth(pos);
					}
					if($(url).is(".appML_page")){
						//alert("goTo");
						jQT.goTo(url,animation);
					}
				}
				else
					location.href=url;
			}
		}
		
		function getAnimationOptions(animation, appear){
			var value = (appear) ? "in" : "out";
			/*
			if(animation=="hide")
				value = (appear) ? "right" : "left";
			*/
			return {direction: value};
		}
		

		
		function animatePanels(panel_out, panel_in){
			$("#appML_navigation_bar >div:eq("+panel_out+") >div").hide();
			$("#appML_navigation_bar >div:eq("+panel_in+") >div").show();
			pages_array[panel_out].hide();
			pages_array[panel_in].show();
		}
		
		
		function animate(fromPage, toPage, animation, backwards){
			if($.support.WebKitAnimationEvent)
				jQT.animate(fromPage, toPage, animation, backwards);
			else{
				var anim="";
				if(animation!=null)
					eval("anim=settings.animation_replacements."+(animation.name));
				else
					anim=default_animation;
				$(fromPage).hide(getAnimationOptions(anim,false),settings.transaction_duration,function(){
					//$(fromPage).trigger('appMLAnimationEnd', { direction: 'out' });
				});
				$(toPage).show(getAnimationOptions(anim,true),settings.transaction_duration,function(){
					$(toPage).trigger('appMLAnimationEnd');
					//updateScroll();  eliminato, funziona tutto lo stesso...
				});
			}
		}
		
		
		// SCROLL FUNCTIONS
		
		function isLandscape(){
			return (window.innerWidth > window.innerHeight);
		}
		
		function getChildDimensions($elem, father_dims, default_percent_width, default_percent_height, max_percent_width, max_percent_height, left_dims){
			// max width and height for landscape and portrait orientations
			var def_percent_width = (default_percent_width!=null && default_percent_width>0) ? default_percent_width : 100;
			var def_percent_height = (default_percent_height!=null && default_percent_height>0) ? default_percent_height : 100;
			
			var w_l, w_p, h_l, hp;
			var max_father_percent_width = (max_percent_width!=null && max_percent_width>0) ? max_percent_width : 70;
			var max_father_percent_height = (max_percent_height!=null && max_percent_height>0) ? max_percent_height : 70;
			var max_w_l=Math.floor(max_father_percent_width * father_dims.landscape.width / 100);
			var max_w_p=Math.floor(max_father_percent_width * father_dims.portrait.width / 100);
			var max_h_l=Math.floor(max_father_percent_height * father_dims.landscape.height / 100);
			var max_h_p=Math.floor(max_father_percent_height * father_dims.portrait.height / 100);
			if(left_dims!=null){
				if(max_w_l>left_dims.landscape.width) 
					max_w_l=left_dims.landscape.width;
				if(max_w_p>left_dims.portrait.width) 
					max_w_p=left_dims.portrait.width;
				if(max_h_l>left_dims.landscape.height) 
					max_h_l=left_dims.landscape.height;
				if(max_h_p>left_dims.portrait.height) 
					max_h_p=left_dims.portrait.height;
			}
			
			// width calculation
			var w=getDimPercent($elem,true);
			if(w>0){
				w_l = Math.floor(w * father_dims.landscape.width / 100);
				w_p = Math.floor(w * father_dims.portrait.width / 100);
			}
			else{
				w=getFixedDim($elem,true);
				if(w>0){
					w_l=w;
					w_p=w;
				}
				else{
					w=def_percent_width;
					w_l = Math.floor(w * father_dims.landscape.width / 100);
					w_p = Math.floor(w * father_dims.portrait.width / 100);
				}
			}
			if(w_l>max_w_l)
				w_l=max_w_l;
			if(w_p>max_w_p)
				w_p=max_w_p;
			
			// height calculation
			var h=getDimPercent($elem,false);
			if(h>0){
				h_l = Math.floor(h * father_dims.landscape.height / 100);
				h_p = Math.floor(h * father_dims.portrait.height / 100);
			}
			else{
				h=getFixedDim($elem,false);
				if(h>0){
					h_l=h;
					h_p=h;
				}
				else{
					h=def_percent_height;
					h_l = Math.floor(h * father_dims.landscape.height / 100);
					h_p = Math.floor(h * father_dims.portrait.height / 100);
				}
			}
			if(h_l>max_h_l)
				h_l=max_h_l;
			if(h_p>max_h_p)
				h_p=max_h_p;
			
			var ret={
				landscape:{
					width: w_l,
					height: h_l
				},
				portrait:{
					width: w_p,
					height: h_p 
				}
			};
			return ret;
		}
		
		function findHeightSpread(){
			var s_w=screen.width;
			var s_h=screen.height;
			var w_w=$(window).width();
			var w_h=$(window).height();
			if(s_w==w_w)
				return s_h-w_h;
			if(s_w==w_h)
				return s_h-w_w;
			if(s_h==w_w)
				return s_w-w_h;
			if(s_h==w_h)
				return s_w-w_w;
		}
		
		function findWindowDimensions(){
			var dim_diff=findHeightSpread();
			var w_l, w_p, h_l, h_p;
			if(isLandscape()){
				w_l=$(window).width();
				h_l=$(window).height();
				w_p=h_l+dim_diff;
				h_p=w_l-dim_diff;
			}
			else{
				w_p=$(window).width();
				h_p=$(window).height();
				w_l=h_p+dim_diff;
				h_l=w_p-dim_diff;
			}
			
			return {
				landscape:{
					width: w_l,
					height: h_l
				},
				portrait:{
					width: w_p,
					height: h_p 
				}
			};
		}
		
		function findPanelsDimensions(){
			var dimensions={};
			
			// window object
			dimensions.window=findWindowDimensions();
			var left_dims={};
			$.extend(true, left_dims, dimensions.window);
									
			// panels dimensions
			var elem=$("#appML_top");
			if(elem.length>0){
				dimensions.top=getChildDimensions(elem,dimensions.window,100,8,100,null);
				left_dims.landscape.height-=dimensions.top.landscape.height;
				left_dims.portrait.height-=dimensions.top.portrait.height;
			}
			elem=$("#appML_bottom");
			if(elem.length>0){
				dimensions.bottom=getChildDimensions(elem,dimensions.window,100,8,100,null);
				left_dims.landscape.height-=dimensions.bottom.landscape.height;
				left_dims.portrait.height-=dimensions.bottom.portrait.height;
			}
			elem=$("#appML_left");
			if(elem.length>0){
				dimensions.left=getChildDimensions(elem,dimensions.window,40,100,null,100,left_dims);
				left_dims.landscape.width-=dimensions.left.landscape.width;
				left_dims.portrait.width-=dimensions.left.portrait.width;
			}
			elem=$("#appML_right");
			if(elem.length>0){
				dimensions.right=getChildDimensions(elem,dimensions.window,40,100,null,100,left_dims);
				left_dims.landscape.width-=dimensions.right.landscape.width;
				left_dims.portrait.width-=dimensions.right.portrait.width;
			}
			
			// pages dimensions
			dimensions.app_body={};
			$.extend(true, dimensions.app_body, left_dims);
			elem=$("#appML_navigation_bar");
			if(elem.length>0){
				dimensions.navigation=getChildDimensions(elem,dimensions.app_body,100,null,100,null);
				left_dims.landscape.height-=dimensions.navigation.landscape.height;
				left_dims.portrait.height-=dimensions.navigation.portrait.height;
			}
			elem=$("#appML_toolbar");
			if(elem.length>0){
				dimensions.toolbar=getChildDimensions(elem,dimensions.app_body,100,null,100,null);
				left_dims.landscape.height-=dimensions.toolbar.landscape.height;
				left_dims.portrait.height-=dimensions.toolbar.portrait.height;
			}

			dimensions.pages={};
			$.extend(true, dimensions.pages, left_dims);
			
			return dimensions;
		}
		
		function areSameDimensions(dim1, dim2){
			if(dim1.landscape.width==dim2.landscape.width && dim1.landscape.height==dim2.landscape.height &&
					dim1.portrait.width==dim2.portrait.width && dim1.portrait.height==dim2.portrait.height)
				return true;
			else
				return false;
		}
		
		function setPanelsDimensions(){
			var resize=true;
			if(appML.dimensions!=null && appML.dimensions.window!=null){
				var window_dims=findWindowDimensions();
				if(areSameDimensions(window_dims,appML.dimensions.window))
					resize=false;
			}
			if(resize)
				appML.dimensions=findPanelsDimensions();
			return resize;
		}
		
		
		function refreshScrollables(){
			var $this=$(this);
			var is_iscroll=$this.is(".iscroll");
			if(is_iscroll){
				var id=$this.attr("id");
				var iScroll=getIScroll(id);
				if(iScroll!=null)
					setWrapperDimensions(iScroll);
				else
					createScrollWithId(id);
			}
			$this.children().each(refreshScrollables);
			if(is_iscroll){
				if(settings.async_sizing)
					scrollable_elems_to_compute.push($this);
				else
					refreshIScrollElem($this);
			}
		}
		
		function refreshPanelDimensions($elem,dims){
			if($elem==null || $elem.length==0)
				return;
			if(isLandscape())
				$elem.width(dims.landscape.width).height(dims.landscape.height);
			else
				$elem.width(dims.portrait.width).height(dims.portrait.height);
		}
		
		function executeFunction(fn){
			if(fn!=null && fn.length>0)
				eval(fn);
		}
		
		function refreshDimensions(callback_fn, only_sections){
			var dimensions=appML.dimensions;
			refreshPanelDimensions($("#appML_top"),dimensions.top);
			refreshPanelDimensions($("#appML_bottom"),dimensions.bottom);
			refreshPanelDimensions($("#appML_left"),dimensions.left);
			refreshPanelDimensions($("#appML_right"),dimensions.right);
			refreshPanelDimensions($("#appML_navigation_bar"),dimensions.navigation);
			refreshPanelDimensions($("#appML_toolbar"),dimensions.toolbar);
			refreshPanelDimensions($("#appML_body_app_container"),dimensions.app_body);
			refreshPanelDimensions($("#appML_content_wrapper"),dimensions.pages);
			
			if(!only_sections){
				$(".appML_section").each(refreshScrollables);
				if(settings.async_sizing)
					computeNextScrollableElem(callback_fn);
				else if(callback_fn!=null && callback_fn.length>0)
					executeFunction(callback_fn);
			}
		}
		
		function computeNextScrollableElem(callback_fn){
			var elem=extractFirstScrollableElemToCompute();
			if(elem!=null){
				refreshIScrollElem(elem);
				setTimeout(function(){computeNextScrollableElem(callback_fn);},0);
			}
			else{
				executeFunction(callback_fn);
			}
		}
		
		function extractFirstScrollableElemToCompute(){
			if(scrollable_elems_to_compute.length>0){
				var ret=scrollable_elems_to_compute[0];
				scrollable_elems_to_compute=scrollable_elems_to_compute.slice(1,iScrolls.length);
				return ret;
			}
			else
				return null;
		}
		
		function createIScroll(){
			$this=$(this);
			var id=$this.attr("id");
			createScrollWithId(id);
		}
		
		function createDialogScroll(){
			$this=$(this);
			var id=$this.attr("id");
			createScrollWithId(id);
			refreshIScrollElem($this);
		}
		
		function createScrollWithId(id, replace_if_exists){
			var can_create=true;
			if(replace_if_exists)
				deleteIScrollWithId(id);
			else
				can_create=(getIScroll(id)==null);
			if(can_create){
				var $elem=$("#"+id);
				
				var iscroll_options={desktopCompatibility : true, doRefreshOnInit : false};
				if($elem.is(".carousel_scroller")){
					var dir=$elem.parent().attr("data-appML-direction");
					var scrollEndFn;
					if(dir!=null && dir=="vertical"){ 
						scrollEndFn=function () {
							var indicator=$("#"+id).closest(".carousel_container").find('.carousel_indicator');
							indicator.children('.selected').removeClass("selected");
							indicator.children('li:nth-child(' + (this.pageY+1) + ')').addClass("selected");
						};
					}
					else{
						scrollEndFn=function () {
							var indicator=$("#"+id).closest(".carousel_container").find('.carousel_indicator');
							indicator.children('.selected').removeClass("selected");
							indicator.children('li:nth-child(' + (this.pageX+1) + ')').addClass("selected");
						};
					}
					iscroll_options=$.extend({},iscroll_options,{
						snap:true,
						momentum:false,
						hScrollbar:false,
						vScrollbar:false,
						onScrollEnd: scrollEndFn
					});
				}
				
				var iScroll=new $.iScroll(id,iscroll_options);
				
				// effettua soltanto il settaggio del wrapper...
				setWrapperDimensions(iScroll);
				
				iScrolls.push(iScroll);
				return iScroll;
			}
			return null;
		}
		
		function getIScroll(id){
			for(i=0;i<iScrolls.length;i++){
				if(iScrolls[i].$elem!=null && iScrolls[i].$elem.attr("id")==id)
					return iScrolls[i];
			}
			return null;
		}
		
		function findIScrollFromWrapper(wrapper_id){
			var iScroll=$("#"+wrapper_id).children(".iscroll");
			if(iScroll.length>0) 
				return getIScroll(iScroll.attr("id"));
			else
				return null;
		}
		
		function updateIScroll(){
			var id=$(this).attr("id");
			updateIScrollWithId(id);
		}
		
		function getSpecifiedDim($elem, width){
			var ret = (width) ? $elem.attr("data-appml-width") : $elem.attr("data-appml-height");
			if(ret==null || ret.length==0)
				ret = (width) ? ($elem.get(0).style.width) : ($elem.get(0).style.height);
			if(ret==null || ret.length==0)
				ret = (width) ? ($elem.css("width")) : ($elem.css("height"));
			return ret;
		}
		
		function getFixedDim($elem,width){
			var ret=getSpecifiedDim($elem, width);
			if(ret!=null && ret.length>0){
				if(ret.indexOf('px') == ret.length-2)
					return parseInt(ret.substring(0,ret.length-2));
				else{
					try{
						return parseInt(ret);
					}catch(err){}
				}
			}
			return -1;
		}
		
		function getDimPercent($elem,width){
			if((width && $elem.is(".expand_width")) || ((!width) && $elem.is(".expand_height")))
				return 100;
			var percent_value = getSpecifiedDim($elem, width);
			if(percent_value==null || percent_value.length==0)
				return -1;
			return (percent_value.indexOf('%') == percent_value.length-1) ? parseInt(percent_value.substring(0,percent_value.length-1)) : -1;
		}
		
		function findWrapperParent($elem){
			var parent=$elem.closest(".iscroll");
			if(parent.length>0)
				return parent;
			else 
				return ($elem.is(".appML_section")) ? $elem : $elem.closest(".appML_section");
		}
		
		function findSectionDimension(id){
			if(id.indexOf("appML_")>=0)
				id=id.substring("appML_".length,id.length);
			var dims=null;
			eval("dims=appML.dimensions."+id+";");
			if(dims!=null)
				return dims;
			else
				return appML.dimensions.pages;
		}
		
		function getActualSectionDimensions(section_name){
			var dim=null;
			eval("dim=appML.dimensions."+section_name);
			if(dim!=null)
				return isLandscape() ? dim.landscape : dim.portrait;
			else
				return null;
		}
		
		function findWrapperParentDims($elem){
			var parent=findWrapperParent($elem)
			if(parent.is(".appML_section")){ // outer iscroll
				var id=parent.attr("id");
				return findSectionDimension(id);
			}
			else{ // direct iscroll in appML_section or section itself
				var iscroll=getIScroll(parent.attr("id"));
				if(iscroll!=null)
					return iscroll.wrapper_dims;
				else{
					return appML.dimensions.window;
				}
			}
		}
		
		function getWrapperDimensions($elem){
			$wrapper=$elem.parent();
			if($wrapper.is(".appML_section"))
				return findSectionDimension($wrapper.attr("id"));
			var outer_dims=findWrapperParentDims($wrapper); 
			var dims=getChildDimensions($wrapper, outer_dims,100,100,100,100);
			return dims;
		}
		
		function setWrapperDimensions(iScroll){
			var dims=getWrapperDimensions(iScroll.$elem); 
			iScroll.wrapper_dims=dims;
		}
		
		
		function cloneAndEmptyElem($elem){
			var temp=$elem.clone();
			temp.empty();
			return temp;
		}
		
		function getElemCopy($elem){
			var id=$elem.attr("id");
			if(id!=null && id.length>0){
				for(i=0;i<elems_copies.length;i++)
					if(elems_copies[i].attr("id")==id)
						return elems_copies[i];
			}
			var cloned=cloneAndEmptyElem($elem);
			if(id!=null && id.length>0)
				elems_copies.push(cloned);
			return cloned;
		}
		
		function getParentsChain($elem){
			var chain=null;
			var nav=$elem;
			var temp=null;
			while(nav!=null){
				nav=nav.parent();
				if(nav.is(".appml_root_div") || nav.is("#overlayContainer")) 
					nav=null;
				else{
					temp=getElemCopy(nav);
					temp.empty();
					if(chain!=null)
						temp.append(chain);
					chain=temp;
				}
			}
			return chain; 
		}
		
		function getScrollElemDimensions($elem){
			var elem_id=$elem.attr("id");
			var wrapper_id=$elem.parent().attr("id");
			var iScroll=getIScroll(elem_id);
			var size_tester=$("#appML_size_tester");
			var dims={ landscape: { width:0, height:0 }, portrait:{ width:0, height:0 } };
			
			// find greatest width
			var max_w=0;
			size_tester.html("");
			size_tester.width(0);
			$elem.clone().appendTo(size_tester);
			size_tester.children().each(function(){ 
				var w=$(this).outerWidth(true);
				if(w>max_w)
					max_w=w;
			});
			
			size_tester.html("");
			//size_tester.width(appML.dimensions.window.landscape.width);
			var tester_w = (max_w>iScroll.wrapper_dims.landscape.width) ? max_w : iScroll.wrapper_dims.landscape.width;
			var chain=getParentsChain($elem);
			chain.appendTo(size_tester);
			var tester_wrapper=chain.find("#"+wrapper_id);
			tester_wrapper.width(tester_w);
			
			if(!tester_wrapper.is(":visible")){
				if(tester_wrapper.css("display")=="none"){
					tester_wrapper.css("display","block");
				}
				tester_wrapper.parents().each(function(){ 
					var $this=$(this); 
					if($this.css("display")=="none"){
						$this.css("display","block");
					}
				}); 
			}

			var clone=$elem.clone();
			resizeInnerIScrollElements(clone,iScroll.wrapper_dims.landscape.width);
			clone.appendTo(tester_wrapper);
			var elem_in_tester=chain.find("#"+elem_id);
			dims.landscape.width=elem_in_tester.width();
			dims.landscape.height=elem_in_tester.height();
			
			tester_w = (max_w>iScroll.wrapper_dims.portrait.width) ? max_w : iScroll.wrapper_dims.portrait.width;
			tester_wrapper.empty();
			tester_wrapper.width(tester_w);
			clone=$elem.clone();
			resizeInnerIScrollElements(clone,iScroll.wrapper_dims.portrait.width);
			clone.appendTo(tester_wrapper);
			elem_in_tester=chain.find("#"+elem_id);
			dims.portrait.width=elem_in_tester.width();
			dims.portrait.height=elem_in_tester.height();
			
			size_tester.html("");
			return dims;
		}
		
		function resizeInnerIScrollElements($elem, width) {
			if($elem.is(".resizeWidth")){
				$elem.width(width);
			}
			if($elem.children().length>0)
				$elem.children().each(function(){ resizeInnerIScrollElements($(this), width); });
		}
		
		function refreshIScrollElem($elem){
			var id=$elem.attr("id");
			var iScroll=getIScroll(id);
			var has_to_init=(iScroll.elem_dims==null);
			var dims=getScrollElemDimensions($elem);  //  oldGetScrollElemDimensions($elem);
			iScroll.elem_dims=dims;
			var wrapper=$(iScroll.wrapper);
			if(!$elem.is(".iscroll_dialog")){
				var refresh_parents=false;
				if(wrapper.attr("data-appml-width")==null){
					if(iScroll.wrapper_dims.landscape.width!=dims.landscape.width){
						iScroll.wrapper_dims.landscape.width=dims.landscape.width;
						refresh_parents=true;
					}
					if(iScroll.wrapper_dims.portrait.width!=dims.portrait.width){
						iScroll.wrapper_dims.portrait.width=dims.portrait.width;
						refresh_parents=true;
					}
				}
				if(wrapper.attr("data-appml-height")==null){
					if(iScroll.wrapper_dims.landscape.height!=dims.landscape.height){
						iScroll.wrapper_dims.landscape.height=dims.landscape.height;
						refresh_parents=true;
					}
					if(iScroll.wrapper_dims.portrait.height!=dims.portrait.height){
						iScroll.wrapper_dims.portrait.height=dims.portrait.height;
						refresh_parents=true;
					}
				}
				if(refresh_parents){
					var parent=findWrapperParent($elem);
					if(parent.is(".iscroll")){
						var parent_iscroll=getIScroll(parent.attr("id"));
						if(parent_iscroll.elem_dims!=null) // otherwise it will be calculated later...
							refreshIScrollElem(parent);
					}
				}
			}

			if(has_to_init){
				$elem.find("img").one('load',imageLoaded); 
				
				iScroll.init();
			}
			
			iScroll.refresh();
		}
		
		function imageLoaded(){
			var $this=$(this);
			var $elem=$this.closest(".iscroll");
			refreshIScrollElem($elem);
		}
		
		
		function getIScrollDimensions($elem){
			var iScroll=null;
			if($elem.is(".iscroll")){
				iScroll=getIScroll($elem.attr("id"));
				return isLandscape() ? iScroll.elem_dims.landscape : iScroll.elem_dims.portrait;
			}
			else{
				var figli=$elem.children(".iscroll");
				if(figli.length>0){
					iScroll=getIScroll(figli.attr("id"));
					if(iScroll!=null){
						return isLandscape() ? iScroll.wrapper_dims.landscape : iScroll.wrapper_dims.portrait;
					}
				}
				return {};
			}
		}
		
		function updateIScrollWithId(id){
			var iScroll=getIScroll(id);
			if(iScroll!=null){
				iScroll.refresh();
				return true;
			}
			else{
				return false;
			}
		}
		
		function updateScroll(){
			$('.iscroll').each(updateIScroll);
		}
		
		function deleteIScrollWithId(id){
			var iScroll=null;
			for(i=0;i<iScrolls.length;i++){
				if(iScrolls[i].$elem!=null && iScrolls[i].$elem.attr("id")==id){
					iScroll=iScrolls[i];
					iScroll.destroy();
					var first_half = (i>0) ? iScrolls.slice(0,i) : new Array();
					var second_half = (iScrolls.length-(i+1)>0) ? iScrolls.slice(i+1,iScrolls.length-(i+1)) : new Array();  
					iScrolls=first_half.concat(second_half);
					return;
				}
			}
		}
		
		function deleteIScroll(){
			$this=$(this);
			var id=$this.attr("id");
			deleteIScrollWithId(id);
		}
		
		function manageIScrollParentMove(iScroll, scroll_x, scroll_y){
			$wrapper=$(iScroll.wrapper);
			var parent=findWrapperParent($wrapper);
			if(parent.is(".iscroll")){
				var parent_iScroll=getIScroll(parent.attr("id"));
				parent_iScroll.manageMove(scroll_x, scroll_y);
			}
		}
		
		function manageIScrollTouchStart(iScroll, point, time){
			var elem_id=iScroll.$elem.attr("id");
			for(i=0;i<iScrolls.length;i++){
				iScrolls[i].manageEnd(point,time,elem_id);
			}
		}
		
		function carouselPrev(){
			var $iScroll=$(this).parent().prev().children(":first");
			var iScroll=getIScroll($iScroll.attr("id"));
			iScroll.scrollToPage('prev', 0);
		}
		
		function carouselNext(){
			var $iScroll=$(this).parent().prev().children(":first");
			var iScroll=getIScroll($iScroll.attr("id"));
			iScroll.scrollToPage('next', 0);
		}
		 
		function adjustCarousel(){
			var container=$(this).closest(".carousel_container");
			var wrapper=$(this).parent();
			var dims=getIScrollDimensions(wrapper);
			var elems=$(this).find("li");
			elems.each(function(){ 
				$(this).width(dims.width);
				$(this).height(dims.height);
			});
			var direction=wrapper.attr("data-appml-direction");
			if(direction==null || direction.length==0)
				direction="horizontal";
			if(direction!=null && direction=="vertical"){
				$(this).width(dims.width);
				$(this).height(dims.height*elems.length);
			}
			else{
				$(this).width(dims.width*elems.length);
				$(this).height(dims.height);
			}
			$(container).find(".carousel_nav").width(dims.width);
			//if(typeof Touch == "object"){
				container.find(".carousel_prev").css("opacity",0);
				container.find(".carousel_next").css("opacity",0);
			/*}
			else{
				container.find('.carousel_prev').bind('click',carouselPrev);
				container.find('.carousel_next').bind('click',carouselNext);
			}*/
		}
		
		function printScrollable(){
			var $this=$(this);
			$this.removeClass("scrollable");
			var iscroll_container=$("<div />").addClass("iscroll_container");
			if($this.is(".appML_page"))
				iscroll_container.addClass("appML_page_container");
			copyContent($this,iscroll_container);
			var iscroll_node=$("<div />").addClass("iscroll").attr("id",$this.attr("id")+"_appML_iscroll_pane");
			iscroll_node.append(iscroll_container);
			$this.append(iscroll_node);
		}
		
		
		
		
		//overlay, alert, confirm, select
		function showOverlay(){
			$("#overlayContainer").html('<div class="darkOverlay"></div>');
			$(".darkOverlay").addClass("darkOverlay_on");
			overlay=true;
		}
	
		function hideOverlay(){
			$(".dialog_container").addClass("off"); 
			$(".darkOverlay").addClass("darkOverlay_off");
			setTimeout(function(){$("#overlayContainer").html('');},300);
			overlay=false;
			$('.active').removeClass('active');
		}
		
		function showLoading(){
			showOverlay();
			$(".darkOverlay").html('<div class="ajaxLoader">loading...</div>');
			$(".ajaxLoader").canvasLoader({
			  backgroundColor:'transparent',
			  color:'#86d4f9',
			  fps:10,
			  radius:40,
			  dotRadius:3  
			  });
			
		}
		
		function hideLoading(){
			hideOverlay();
		}
															
		function showDialog(options){
				
			var settings = {
	  	    		type                   : "alert", //confirm, select
	  				confirmCallback		   : function(){hideDialog();},
	  				denyCallback		   : function(){return false;},
	  				title				   : "Alert",
	  				message				   : "This is a text message to show this tooltip!",
	  				select_options	       : "no options in this select"
	  			};
	  			
  			if ( options ) { 
  				$.extend( settings, options );
  			}
  			
			if(!overlay)
  				showOverlay();
  			
			$(".darkOverlay").html("");

  			var ok_button='<div class="dialog_button ok">ok</div>';
  			var deny_button="";
  			var confirm_html="";
  			var select_html="";
  			
  			(settings.type=="confirm") ? deny_button+='<div class="dialog_button deny">no</div>' : "";

  			if(settings.type=="confirm" || settings.type=="alert"){
  				 confirm_html+='<div class="dialog_header alert">'+settings.title+'</div><div class="dialog_body alert" id="dialog_scroller_wrapper"><div style="text-align:center" class="iscroll_dialog" id="dialog_scoller">'+settings.message+'</div></div>'+ok_button+''+deny_button;
  			}
  			else{
  				 select_html+='<div class="dialog_header select">'+settings.title+'<div class="close_dialog"><div class="x_close_dialog"></div></div></div><div class="dialog_body select" id="dialog_scroller_wrapper"><div style="text-align:center" class="iscroll_dialog" id="dialog_scoller">'+settings.select_options+'</div></div>';
  			}
  			
  			var message_html='<div class="darkOverlay"></div><div class="dialog_container">'+confirm_html+''+select_html+'</div>';
  			
			$("#overlayContainer").append($(message_html));

  			//dialog ok button
  			$('.dialog_button.ok').bind('click', function() {
  				settings.confirmCallback();
  				hideDialog();
  			});
  			
  			//dialog deny button
  			$('.dialog_button.deny').bind('click', function() {
  				settings.denyCallback();
  				hideDialog();
  			});
  			
  			//select combobox close button
  			$('.close_dialog').bind('click', function(){
  				hideDialog();
  			});
		
  			adjustDialogPosition();
  			
  			//dialog showing
  			$(".dialog_container").addClass("on"); 
  		}
		
		function adjustDialogPosition(){
			var dialog=$(".dialog_container");
			if(dialog.length>0){
				var win_dims=getActualSectionDimensions("window");
				var dialog_left_margin=(win_dims.width-parseInt(dialog.css("width")))/2 ;
	  			var dialog_top_margin=(win_dims.height-parseInt(dialog.css("height")))/2;
	  			
	  			//dialog container positioning
	  			dialog.css({
	  				  top:dialog_top_margin+"px",
	  				  left:dialog_left_margin+"px"
	  			});
			}
		}
		
		function hideDialog(){
			hideOverlay();
		}
		
		function login(){
			return true;
        }
	
	    function enter(){
	    	goNth(1);
	    	$('#appML_toolbar').show();
        }
	

	    
		
	    // translation functions
	    var appml=null;
	    
	    function generateId(){
	    	max_id++;
	    	return "appML_auto_"+max_id;
	    }
	    
	    function getOrGenerateId($elem){
	    	var id=$elem.attr("id");
	    	if(id!=null && id.length>0)
	    		return id;
	    	else
	    		return generateId();
	    }
	    
	    function getAppmlAttribute(element, attribute){
	    	var attr=element.attr(attribute);
	    	if(attr==null || attr.length==0)
	    		attr=element.attr("data-appml-"+attribute);
	    	if(attr==null || attr.length==0)
	    		return null;
	    	else
	    		return attr;
	    }

	    function getAppMLDiv(appml_tag, outer_div_id, outer_div_class, default_inner_html){
	    	var tag = appml.find(appml_tag);
	    	if(tag.length==0)
	    		return null;
	    	
	    	// get appml tag name from selector
	    	if(appml_tag[0]=="#" || appml_tag[0]==".")
	    		appml_tag=appml_tag.substring(1,appml_tag.length);
	    	
	    	var has_id=(outer_div_id!=null && outer_div_id.length>0);
	    	var has_class=(outer_div_class!=null && outer_div_class.length>0);
	    	var has_default_html=(default_inner_html!=null && default_inner_html.length>0);
	    	var class_section = (appml_tag=="top" || appml_tag=="left" || appml_tag=="bottom" || appml_tag=="right") ? " appML_section" : "";
	    	var attr=getAppmlAttribute(tag, "scrollable");
	    	var class_scrollable = ((attr!=null && attr=="false") || 
	    			(attr==null && (appml_tag=="top" || appml_tag=="bottom" || appml_tag=="navigation" || appml_tag=="toolbar")) ) ? "" : " scrollable";
	    	var class_autofill = ((appml_tag=="navigation" || appml_tag=="toolbar" || appml_tag=="left") && tag.html().length==0) ? " appML_auto_fill" : "";
	    	attr=getAppmlAttribute(tag, "width");
	    	var div_width=(attr!=null) ? attr : ((appml_tag=="top" || appml_tag=="bottom") ? "100%" : "");
	    	attr=getAppmlAttribute(tag, "height");
	    	var div_height=(attr!=null) ? attr : ((appml_tag=="left" || appml_tag=="right") ? "100%" : "");
	    	var its_class=(tag.attr("class")!=null && tag.attr("class").length>0) ? tag.attr("class") : "";
	    
	    	var html_str="<div id='"+(has_id ? outer_div_id : "appML_"+appml_tag)+"' class='appML_div"+class_section+class_scrollable+class_autofill+
	    		(its_class.length>0 ? " "+its_class : "")+(has_class ? " "+outer_div_class+"'" : "'")+
	    		(div_width.length>0 ? " data-appml-width='"+div_width+"'" : "")+ (div_height.length>0 ? " data-appml-height='"+div_height+"'" : "")+
				((appml_tag=="left" || appml_tag=="right") ? " style='float:"+appml_tag+";'" : "")+"></div>";
	    	
	    	var html=$(html_str);
	    	if(tag.html().length>0)
	    		copyContent(tag,html);
	    	else if(has_default_html)
	    		html.append($(default_inner_html));
	    	return html;
	    }
	    
	    function getContentFloatStyle(){
	    	var left=(appml.children("left").length>0);
	    	var right=(appml.children("right").length>0);
	    	if(left && (!right))
	    		return " style='float:right;'";
	    	else if((!left) && right)
	    		return " style='float:left;'";
	    	else if(left && right)
	    		return " style='float:left;'";
	    	else
	    		return "";
	    }

	    function getPageHtml($page){
	    	var id=getOrGenerateId($page);
	    	id=" id='"+id+"'";
	    	var title=getAppmlAttribute($page, "title");
	    	title = (title!=null) ? " data-appml-title='"+title+"'" : "";
	    	var attr=getAppmlAttribute($page,"scrollable");
	    	var class_scrollable = (attr!=null && attr=="false") ? "" : " scrollable";
	    	return "<div  "+id+title+" class='appML_page"+class_scrollable+"' data-appml-width='100%' data-appml-height='100%'>"+$page.html()+"</div>";  //  class='scrollable'
	    }

	    function getPanelHtml($panel, standard_tags){
	    	var id=getOrGenerateId($panel);
	    	var wrapper_id=" id='"+id+"_wrapper'";
	    	id=" id='"+id+"'";
	    	
	    	var title=getAppmlAttribute($panel,"title");
	    	title = (title!=null) ? " data-title='"+title+"'" : "";
	    	 
	    	var icon=getAppmlAttribute($panel,"icon");
	    	icon = (icon!=null) ? " data-icon='"+icon+"'" : "";

	    	var html="<div "+wrapper_id+title+icon+"><div "+id+" class='appML_panel appML_div'>";
	    	
	    	var prefix="";
	    	if(standard_tags)
	    		prefix=".appml-";
	    	var pages=$panel.children(prefix+"page").each(function(){
	    		html+=getPageHtml($(this));
	    	});

	    	html+="</div></div>";

	    	return html;
	    }
	    	
	    function getPanelsHtml(standard_tags){
	    	var html="";
	    	var id_prefix="";
	    	var class_prefix="";
	    	if(standard_tags){
	    		id_prefix="#";
		    	class_prefix=".appml-";
	    	}
	    	var panels=appml.find(id_prefix+"content").children(class_prefix+"panel").each(function(){
	    		html+=getPanelHtml($(this), standard_tags);
	    	});
	    	return html;
	    }
	    
	    function copyContent($from, $to){
	    	$from.contents().appendTo($to);
	    }
	    
	    function copyContentAndReplace($from, $to){
	    	copyContent($from,$to);
	    	$from.replaceWith($to);
	    }
	    
	    function replaceScrollable(){
	    	var $this=$(this);
	    	var id=getOrGenerateId($this);
	    	var new_div=$("<div/>").attr("id",id).addClass("scrollable");
	    	var scrollable_dims=0;
	    	var dim=getAppmlAttribute($this,"width");
	    	if(dim!=null){
	    		new_div.attr("data-appml-width",dim);
	    		scrollable_dims++;
	    	}
	    	dim=getAppmlAttribute($this,"height");
	    	if(dim!=null){
	    		new_div.attr("data-appml-height",dim);
	    		scrollable_dims++;
	    	}
	    	if(scrollable_dims==0){
	    		// let's manage here default, in the case one insert a scrollable elem without specifying any dimension.
	    	}
	    	copyContentAndReplace($this,new_div);
	    }

	    function getCarouselNavigatorDiv(elems){
	    	var nav_div="<div class='carousel_nav'>";
	    		nav_div+="<div class='carousel_prev'>&larr; prev</div>";
	    		
		    	nav_div+="<ul class='carousel_indicator'>";
		    	var sel_index=1;
		    	for(i=1;i<=elems.length;i++)
		    		nav_div+="<li"+((i==sel_index) ? " class='selected'" : "")+">"+i+"</li>";
		    	nav_div+="</ul>";
		    	
		    	nav_div+="<div class='carousel_next'>&rarr; next</div>";
	    	nav_div+="</div>";
	    	return nav_div;
	    }
	    
	    function replaceCarousel(){
	    	var $this=$(this);
	    	var elems=$this.find("li");
	    	if(elems.length==0){
	    		$this.replaceWith($("<div/>"));
	    		return;
	    	}
	    	
	    	var id=getOrGenerateId($this);
	    	var container_div=$("<div/>").addClass("carousel_container");
	    	var wrapper_div=$("<div/>").attr("id",id+"_wrapper").addClass("carousel_wrapper");
	    	var w=getAppmlAttribute($this,"width");
	    	if(w!=null)
	    		wrapper_div.attr("data-appml-width",w);
	    	var h=getAppmlAttribute($this,"height");
	    	if(h!=null)
	    		wrapper_div.attr("data-appml-height",h);
	    	var dir=getAppmlAttribute($this,"direction");
	    	if(dir!=null)
	    		wrapper_div.attr("data-appml-direction",dir);
	    	var carousel_div=$("<div/>").attr("id",id).addClass("carousel_scroller iscroll").html($this.html());
	    	var navigation_div=$(getCarouselNavigatorDiv(elems));
	    	
	    	wrapper_div.append(carousel_div);
	    	container_div.append(wrapper_div);
	    	container_div.append(navigation_div);
	    	
	    	$this.replaceWith(container_div);
	    }
	    
	    function setLoadingAppML(is_loading){
	    	if(is_loading){
	    		$("#appML_body_div").css("opacity","0");
	    		$("#appML_loading").show();
	    	}
	    	else{
	    		$("#appML_loading").hide();
	    		$("#appML_body_div").css("opacity","100");
	    	}
	    }
	    
	    function translateAppML(){
	    	
		    var prefix="";
	    	appml=$("appml");
		    if(appml.length==0){
		    	appml=$("#appml");
		    	if(appml.length==0)
		    		return;
		    	else
		    		prefix="#";
		    }
		    
		    appML_ready_fn=getAppmlAttribute(appml,"onready");
		    if(appML_ready_fn==null){
		    	var in_body=$('body').attr("data-appml-onload");
		    	if(in_body!=null)
		    		appML_ready_fn=in_body;
		    }
		    
		    var class_prefix="";
		    if(prefix.length>0)
		    	class_prefix=".appml-";
		    appml.find(class_prefix+"scrollable").each(replaceScrollable);
		    appml.find(class_prefix+"carousel").each(replaceCarousel);
		    
	    	var loading_html=getAppMLDiv(prefix+"loading",null,null,"<div class='appMLLoading'><div style='text-align:center'><img src='appML_loading.gif' style='margin:0px auto'></div></div>");
		    var top_html=getAppMLDiv(prefix+"top");
		    var left_html=getAppMLDiv(prefix+"left");
		    var right_html=getAppMLDiv(prefix+"right");
		    var bottom_html=getAppMLDiv(prefix+"bottom");
		    var navigation_html=getAppMLDiv(prefix+"navigation","appML_navigation_bar","expand_width");
		    var toolbar_html=getAppMLDiv(prefix+"toolbar",null,"expand_width");
		    var panels_html=$(getPanelsHtml(prefix.length>0));
		    	
		    var body_html=$("<div class='appml_root_div'></div>");
		    body_html.append($("<div id='appML_size_tester' style='position:absolute; z-index:-1; opacity:0;filter:alpha(opacity=0);'></div>"));
		    if(loading_html!=null)
	    		body_html.append(loading_html);
    
		    var body_div=$("<div id='appML_body_div' style='position:absolute; z-index:1;'></div>");

	    	if(top_html!=null)
    			body_div.append(top_html);
    		if(left_html!=null)
    			body_div.append(left_html);
	    		
	    	var app_container=$("<div id='appML_body_app_container' class='appML_section' "+getContentFloatStyle()+"></div>");

    		if(navigation_html!=null)
    			app_container.append(navigation_html);
	    	
    		var content_wrapper=$("<div id='appML_content_wrapper'></div>");
    		var content=$("<div id='appML_content'></div>");
	    	if(panels_html!=null)
				content.append(panels_html);
    		content.appendTo(content_wrapper);
    		content_wrapper.appendTo(app_container);
    		
			if(toolbar_html!=null)
				app_container.append(toolbar_html);
			
			
			app_container.appendTo(body_div);
	    		
    		if(right_html!=null)
    			body_div.append(right_html);
    		if(bottom_html!=null)
    			body_div.append(bottom_html);
	    		
    		body_div.appendTo(body_html);
		    appml.remove();
		    appml=null;
		    $('body').append(body_html);
	    }
		

	    // init functions
		
	    function initHtmlBody(){
			
			$('body').prepend('<div id="overlayContainer"></div>');
			
		}
		
		function initHtmlElements(){

			$('.select_filter').livequery('click', function(){
			 	$(":focus").blur();
		    	var option_text;
		    	var sel;
		    	var val;
		    	var options_html="";
		    	var $select=$(this).next();
		    	var select=$select.get(0);
		    	
		    	for(var i=0; i<select.options.length; i++){
		    		option_text=$(select.options[i]).text();
		    		val=select.options[i].value;
		    		sel=(select.options[i].selected==true) ? "selected" : "";
		    		option_html="<div class='select_options "+sel+"' data-optionValue='"+val+"' >"+option_text+"</div>";
		    		options_html+=option_html;
		    	}
		    	var sel_title=$select.attr("data-title");
		    	showDialog({
		    		type: "select",
		    		select_options:options_html,
		    		title: sel_title
				});
		    	
	
	    		$(".select_options").bind("click",function(){
	
	    			$(".select_options").removeClass("selected");
	    			$(this).addClass("selected");
	    			selected_value=$(this).attr("data-optionValue");
	    			for(var i=0; i<select.options.length; i++){
	    				if(select.options[i].value==selected_value){
	    					select.options.selectedIndex=i;
	    				}
	    			}
	    			hideDialog();
	    		});
				
		    });
			
			
			// login
			$('span a').click(function() {
		        if(login())
		           enter();
		        else
		            showDialog("login failed");       
		    });
			

			// input managment
			
			$("input:visible, textarea:visible").livequery(function(){
				var input=$(this);
				var filter_height=parseInt(input.height()+2);
				var eraser_offset=parseInt(input.width()-10);
				(input.next().get(0)) ? input.next().remove() : "";
				(input.prev().get(0)) ? input.prev().remove() : "";
				if(input.attr("type")!="checkbox" && input.attr("type")!="radio"){
					if(input.attr("type")!="textarea") input.parent().append('<div class="input_eraser" style="left:'+eraser_offset+'px"></div>');
					input.parent().prepend("<div class='input_filter' style='height:"+filter_height+"px'></div>");
				}
			});
		
			$("input[type=checkbox]:visible , input[type=radio]:visible").livequery(function(){
				var input=$(this);
				input.parent().append("<span class='checkAndRadioLabel'>"+input.attr("data-appml-label")+"</span>");
			});
			
		
			$(".input_eraser").livequery("click",function(){
				$(this).prev().attr("value","");
				$(this).hide();
			});
			
			$("input:focus, textarea:focus").livequery("blur",function(){
				($(this).attr("value")!="") ? $(this).next().show() : $(this).next().hide(); 
			});
			
			
			$(".input_filter").livequery("click",function(e){
				if($(this).attr("type")=="radio" || $(this).attr("type")=="checkbox")
				$("input:visible").each(function(){
					if($(this).attr("type")!="radio" && $(this).attr("type")!="checkbox")
						($(this).attr("value")!="") ? $(this).next().show() : $(this).next().hide(); 
				});
				$el=$(e.target);
				var input=$el.next();
				input.focus();
			});	
			
			$("select:visible").livequery(function(){
				$(this).attr("disabled","disabled");
				var filter_height=parseInt($(this).height()+9);
				$(this).parent().prepend("<div class='select_filter' style='height:"+filter_height+"px'></div>");
			});
			
		}
		
		this.init = function() {
			
			translateAppML();
			
			setLoadingAppML(true);
		    
			$(".expand_width").each(function(){ this.style.width="100%"; });
			$(".expand_height").each(function(){ this.style.height="100%"; });

			//setPanelsDimensions();
			
			initHtmlBody();

			pages_number=$(options.selector).children().length;
			if(pages_number==1)
				$("#appML_toolbar").hide();
			if(settings.start_page>pages_number-1){
				settings.start_page=pages_number-1;
			}
			
			$(options.selector).children().each(function(index,child){	
				injectTitlePage($(this).attr("data-title"),$(this).attr("data-loginPanel"),index);
				var menu_url = ($(this).attr("data-loginPanel")=="true") ? "logout" : "#"+$(this).find(":first-child").attr("id");
				injectMenuItems($(this).attr("data-title"),$(this).attr("data-icon"),menu_url,index);
				pages_array.push($(this));
				if(index!=settings.start_page)
					$(this).hide();
				$(this).css("position","absolute","overflow","hidden");
				$(this).css("width","100%");
				$(this).html("<div class='AppManagerPage'>"+$(this).html()+"</div>");
			});
			
			setElementAsSelected(current_page);

			initHtmlElements();

			//setHeight();	
			if(settings.login) $('#appML_toolbar').hide();
			
		};
		
		this.start = function(){
			$(".scrollable").livequery(printScrollable);
			
			//refreshDimensions("appML.startEnd();");
			
			$(window).bind('onorientationchange' in window ? 'orientationchange' : 'resize', function (e) { appML.screenResize(); });
			$(document).bind('touchmove', function (e) { e.preventDefault(); });
			$("a").bind('click', function (e) { e.preventDefault(); }); // per evitare il #id nei browser...
			
			this.adjustToScreen(appML_ready_fn+"; setLoadingAppML(false); ");

			$('.iscroll:visible').livequery(updateIScroll);   
			$('.iscroll_dialog:visible').livequery(createDialogScroll,deleteIScroll);  
			$('.carousel_scroller').livequery(adjustCarousel);
		};
		
		
	    //public functions
		this.appManagerShowDialog=function(options){
			showDialog(options);
		};
		
		this.appManagerShowLoading=function(){
			showLoading();
		};
		this.appManagerHideLoading=function(){
			hideLoading();
		};
		
		this.adjustToScreen = function (callback_fn){
			var resize=setPanelsDimensions();
			if(resize)
				refreshDimensions(callback_fn);
			else
				updateScroll();
			adjustDialogPosition();
			if(!resize)
				executeFunction(callback_fn);
		};
		
		this.screenResize = function(){
			refreshDimensions(null,true);
			this.adjustToScreen();
		};
		
		this.goTo = function(url,animation){
			goUrl(url,animation);
		};
		
		this.isInCurrentPanel = function(page_id_or_hash){
			return isPageInCurrentPanel(page_id_or_hash);
		};
		
		this.appMLGetPanels = function(){
			return getPanels();
		};
		
		this.animatePages = function(fromPage, toPage, animation, backwards){
			animate(fromPage, toPage, animation, backwards);
		};
		
		this.iScrollDomModified = function($elem){
			//var id=$elem.attr("id");
			//console.log("DOM MODIFIED on iScroll "+id);
		};
		
		this.translateBody = function(){
			translateAppML();
		};
		
		this.landscapeScreen = function(){
			return isLandscape();
		};
		
		this.manageParentMove = function(iScroll, move_x, move_y){
			manageIScrollParentMove(iScroll, move_x, move_y);
		};
		
		this.manageTouchStart = function(iScroll, point, time){
			manageIScrollTouchStart(iScroll, point, time);
		};

	};
	
	
	$(window).load(/*one('ready',*/function(){
		
		appML=new $.appManager({ 
			selector:"#appML_content",
			transaction_duration     : 200,
			header                   : true,
			page_out_effect          : 'fade',    //blind, bounce, clip, explode, fold, highlight, puff, pulsate, scale, shake, size, slide
			page_in_effect           : 'fade',
			header_out_effect        : 'fade',    
			header_in_effect         : 'fade',
			between_effects_delay    : 300,
			start_page               : 0,
			menu_top_margin		     : 0,
			menu_left_margin         : 10,
			banner 				     : false,
			login                    : false
	    });
		
		appML.init(); 
		var screen_sizes=screen.width+','+screen.height;
		var home_icon;
		(location.pathname.indexOf("iPhone")!=-1)? home_icon="iPhone_icon.png" : home_icon="iPad_icon.png";
		jQT = new $.jQTouch({
			icon: home_icon,
			addGlossToIcon: false,
			startupScreen: 'hicApp.png',
			statusBar: 'black',
			preloadImages: []
		});
	   	jQT.init();
	   	
		appML.start();
		//*/
	});
	
	
}(jQuery));

var appML;
var jQT;



