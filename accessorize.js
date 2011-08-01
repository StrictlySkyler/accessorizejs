/*
Accessorize.js is a JavaScript utility to help make webpages accessible to users
with visual impairment and other disabilities.
Copyright (C) 2011 Skyler Brungardt & Jeff Ritenburg

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
(function(){
	//For browser optimizations.  (Where applicable.)
	'use strict';

	//Using this later for firing the script when the DOM has finished loading,
	//as seen in jQuery.
	var ready,
	//Used later.
		hijackXHR,
		domainScope,
		accessorize,
		hostname,
	//Hijack the XHR send method, to ensure that AJAX data added to the DOM
	//gets any styles activated automatically added to it.
		xhrMod = XMLHttpRequest.prototype.send,
	//Check to see if onreadystatechange (RSC) has already been modified, and
	//modify it with our code if it hasn't.
		onreadystatechange = function() {
		//See if the original RSC has been saved, and if it has, merge.
		if (typeof (onreadystatechange.original) === 'function') {
			onreadystatechange.original.apply(this, arguments);
		}
		//See if the after event behavior has been declared, and merge if it
		//has.
		if (typeof (this.onAfterRSCListener) === 'function') {
			this.onAfterRSCListener.apply(this, arguments);
		}
	};

	domainScope = function() {
		//Try to grab the most universal hostname for the domain on which
		//this library is implemented, based upon the number of octets in
		//the domain:

		//	#		Example				Scope
		//	1		localhost			Anything on localhost.
		//	2&3		domain.org			Anything on domain.org + subdomains.
		//	>3		some.sub.site.org	Only that specific site.

		//You might modify this to fit your organization specifically, such
		//as by removing this bit of code, and instead using:
		//	document.cookie = 'domain=yoursite.org'
		hostname = (window.location.hostname).split('.');
		if (hostname.length === 1) {
			document.cookie = 'domain=' + hostname;
		} else if (hostname.length === 2) {
			document.cookie = 'domain=' + hostname[0] + '.' + hostname[1];
		} else if (hostname.length === 3) {
			document.cookie = 'domain=' + hostname[1] + '.' + hostname[2];
		} else {
			document.cookie = 'domain=' + window.location.hostname;
		}
	};
	//End domainScope

	//This is the main function in the library, which gets called when the DOM
	//is finished loading.
	accessorize = function() {
		//Grab the element to which this library is tied; the author suggests
		//using a buttontag for semantic purposes, though any element with the
		//appropriate ID should work. It should be styled to be high contrast,
		//despite the site appearance otherwise.
		var handle = document.getElementById('accessorize'),
			parent = handle.parentNode,
			popup = document.createElement('div'),
			overlay = document.createElement('div'),
			contrastButton = document.createElement('button'),
			invertButton = document.createElement('button'),
			fontBigButton = document.createElement('button'),
			closePopup = document.createElement('button'),
			popupButtons = [contrastButton,invertButton,fontBigButton,closePopup],
			//Get all of the elements in the DOM, for working with later.
			everything = document.body.getElementsByTagName('*'),
			//Declare some things we'll use later.
			i,
			j,
			element,
			contrastOn = false,
			invertOn = false,
			fontBig = false,
			contrastSwitch,
			invertSwitch,
			fontBigSwitch,
			fontSizeMatch,
			turnOnContrast,
			turnOffContrast,
			turnOnInvert,
			turnOffInvert,
			turnOnFont,
			turnOffFont,
			hover,
			buildInterface,
			addListeners,
			alreadyEnabled,
			//Anything that should be treated as a link/button.
			//Might be expanded later.
			links = ['A','BUTTON'],
			//All of the content tags.
			content = ['P','S','I','B','DD','DT','EM','H1','H2','H3','H4','H5','H6','ABBR','CODE','CITE','SAMP','SMALL','STRONG','ADDRESS','BLOCKQUOTE','AUDIO','VIDEO','INPUT','TEXTAREA','SELECT','LEGEND','OPTION','SECTION','ARTICLE','MARK','FIGURE','LABEL','FIGCAPTION','CAPTION','DEL','TR','TH','TD','DT','DD','INS','SUB','SUP','SPAN','PRE','SUMMARY'],
			//Structural & block-level elements.
			blocks = ['ASIDE','DIV','SECTION','NAV','TABLE'],
			//Lists are separate, for making background images visible, if
			//they're set using custom images as bullets.  Other things might
			//go here in the future.
			lists = ['LI'],
			//Sniff out if we're in IE...
			ieCheck = /MSIE \d/.exec(navigator.userAgent),
			//...Check our version if we are...
			ieVersion = /MSIE/.test(ieCheck) ? parseInt(/\d/.exec(ieCheck),10) : null,
			//...and report if it's one of the older ones.
			ieOld = ieVersion !== null && ieVersion < 9 ? true : false,
			//Check to see if we've enabled any of these accessibility features
			//in the past, or on another page in this domain. These are also
			//called during switching events, to help with AJAX enabling the
			//features at other times.
			contrastCheck = /contrastOn=true/.test(document.cookie),
			invertCheck = /invertOn=true/.test(document.cookie),
			fontCheck = /fontBig=true/.test(document.cookie),
			accessorizeCheck = /accessorizeNode/;
		/***** End var declaration for accessorize() *****/

		//Listeners to add styles on the buttons created on mouseover and
		//mouseout events. Added to the elements further down.
		hover = function(elem) {
				elem.onmouseover = function mouseOn() {
					this.style.color = '#ffffff';
					this.style.background = '#333333';
					this.style.boxShadow = '0 0 5px 0 #000000';
				};

				elem.onmouseout = function mouseOut() {
					this.style.color = '#000000';
					this.style.background = '#ffffff';
					this.style.boxShadow = '0 0 1px 0 #000000';
				};

		};

		//This function builds out the overlay interface used to toggle on and
		//off the various features of this library. It adds elements to the DOM,
		//and styles them with some high-contrast styles.
		buildInterface = function() {
			//Give the elements some appropriate identification.
			popup.setAttribute('id', 'popup');
			overlay.setAttribute('id', 'overlay');
			closePopup.setAttribute('id', 'closePopup');
			contrastButton.setAttribute('id', 'contrastButton');
			invertButton.setAttribute('id', 'invertButton');
			fontBigButton.setAttribute('id', 'fontBigButton');

			//Give them content.
			contrastButton.innerHTML = 'Enable High Contrast';
			invertButton.innerHTML = 'Invert Contrast';
			fontBigButton.innerHTML = 'Make Fonts Easier to Read';
			closePopup.innerHTML = 'Close This Popup';

			//Insert the overlay as a sibling after the handle in the DOM, and
			//add the popup to it.
			parent.insertBefore(overlay, handle.nextSibling);
			overlay.appendChild(popup);

			//Iterating through the buttons on the popup, adding them to the
			//popup, setting some styles on them, and making them keyboard
			//navigable.
			for (i = 0, popupButtons.length; i < popupButtons.length; i++) {
				popup.appendChild(popupButtons[i]);
				popupButtons[i].style.cursor = 'pointer';
				popupButtons[i].style.padding = '5px';
				popupButtons[i].style.margin = '5px';
				popupButtons[i].style.display = 'block';
				popupButtons[i].style.border = '1px solid #333333';
				popupButtons[i].style.fontSize = '20px';
				popupButtons[i].style.textAlign = 'center';
				popupButtons[i].style.boxShadow = '0 0 1px 0 #000000';
				popupButtons[i].style.borderRadius = '3px';
				popupButtons[i].style.width = '270px';
				popupButtons[i].style.background = '#ffffff';
				popupButtons[i].setAttribute('tabindex', '1');
				//Old versions of IE use a different syntax for the class
				//attribute.
				if (ieOld) {
					popupButtons[i].setAttribute('className', 'accessorizeNode');
				} else {
					popupButtons[i].setAttribute('class', 'accessorizeNode');
				}
			}

			//Set a common style for the buttons, and add the earlier event
			//listeners.
			for (i=0, popupButtons.length; i < popupButtons.length - 1; i++) {
				popupButtons[i].style.color = '#000000';
				hover(popupButtons[i]);
			}

			//Set the top and bottom buttons to have some nice more-rounded
			//corners.
			popupButtons[0].style.borderRadius = '7px 7px 3px 3px';
			popupButtons[popupButtons.length - 1].style.borderRadius = '3px 3px 7px 7px';
			//The bottom button, which closes the popup, looks different to make
			//it easy to spot how it closes.
			closePopup.style.color = "#000000";
			closePopup.style.background = '#99ccff';
			closePopup.onmouseover = function mouseOn() {
				this.style.color = '#ffffff';
				this.style.background = '#333333';
				this.style.boxShadow = '0 0 5px 0 #000000';
			};

			closePopup.onmouseout = function mouseOut() {
				this.style.color = '#000000';
				this.style.background = '#99ccff';
				this.style.boxShadow = '0 0 1px 0 #000000';

			};

			//The overlay darkens the background transparently, making the popup
			//easier to see.
			overlay.style.width = '100%';
			overlay.style.height = '100%';
			overlay.style.position = 'fixed';
			overlay.style.zIndex = '99998';
			overlay.style.display = 'none';
			overlay.style.left = '0';
			overlay.style.top = '0';
			//Filters and syntax differences for old IE, versus modern browsers.
			if (ieOld) {
				overlay.style.zoom = '1';
				overlay.style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#CC000000,endColorstr=#CC000000)';
				overlay.setAttribute('className', 'accessorizeNode');
				popup.setAttribute('className', 'accessorizeNode');
			} else {
				overlay.style.backgroundColor = 'rgba(0,0,0,.8)';
				overlay.setAttribute('class', 'accessorizeNode');
				popup.setAttribute('class', 'accessorizeNode');
				popup.style.borderRadius = '20px';
				popup.style.boxShadow = '0 0 10px #ffffff';
				popup.style.MozBorderRadius = '10px';
			}

			//Set the bounds of the popup, which is centered in the window.
			popup.style.width = '280px';
			popup.style.height = '165px';
			popup.style.background = '#ffffff';
			popup.style.display = 'block';
			popup.style.position = 'absolute';
			popup.style.zIndex = '99999';
			popup.style.border = '10px solid #333333';
			popup.style.left = ((document.getElementsByTagName('html')[0].clientWidth / 2) - 150).toString() + 'px';
			popup.style.top = ((document.getElementsByTagName('html')[0].clientHeight / 2) - 96).toString() + 'px';
		};
		//End buildInterface

		//The addListeners function adds the appropriate event listeners for
		//interface clicks on our elements.
		addListeners = function() {
			//Each of the listeners for button clicking.
			handle.onclick = function showPopup() {
				overlay.style.display = 'block';
			};

			closePopup.onclick = function closeClick() {
				overlay.style.display = 'none';
			};

			contrastButton.onclick = contrastSwitch;

			invertButton.onclick = invertSwitch;

			fontBigButton.onclick = fontBigSwitch;
		};
		//End addListeners

		//Switch the contrast when appropriate.
		contrastSwitch = function() {
			//In addition to being called above for saving state between
			//refreshes/same domain pages, we check here to see that it hasn't
			//changed due to an AJAX event.
			contrastCheck = /contrastOn=true/.test(document.cookie);
			//Check to see if it's already on.  If not, turn it on and go.
			if (!contrastCheck || !contrastOn) {
				contrastOn = true;
				//The cookie will track according to the domain you set above.
				document.cookie = 'contrastOn=true';
				//Switch it on.
				turnOnContrast();

			} else {
				//If it's already on, turn it off and go.
				contrastOn = false;
				document.cookie = 'contrastOn=false';

				turnOffContrast();
			}
			//Check to see if we've also inverted the contrast, and adjust the
			//elements appropriately.
			if (invertOn) {
				invertOn = false;
				invertButton.innerHTML = 'Invert Contrast';
				document.cookie = 'invertOn=false';
			}
		};
		//End contrastSwitch

		//Same as the contrastSwitch function above, except we're inverting the
		//styles we used, since some folks find this easier to see.
		invertSwitch = function() {
			invertCheck = /invertOn=true/.test(document.cookie);
			if (!invertCheck || !invertOn) {
				invertOn = true;
				document.cookie = 'invertOn=true';

				turnOnInvert();

			} else {
				invertOn = false;
				document.cookie = 'invertOn=false';

				turnOffInvert();
			}
			if (contrastOn) {
				contrastOn = false;
				contrastButton.innerHTML = 'Enable High Contrast';
				document.cookie = 'contrastOn=false';
			}
		};
		//End invertSwitch

		//Make the fonts big, and remove custom fonts, which might make them hard
		//to read.
		fontBigSwitch = function() {
			fontCheck = /fontBig=true/.test(document.cookie);
			if (!fontCheck || !fontBig) {
				fontBig = true;
				document.cookie = 'fontBig=true';

				turnOnFont();

			} else {
				//Put the fonts back when we turn it off.
				fontBig = false;
				document.cookie = 'fontBig=false';

				turnOffFont();
			}
		};
		//End fontBigSwitch

		turnOnContrast = function() {
			//Iterate through everything that isn't created by this library.
			for (i = 0, everything.length; i < everything.length; i++) {
				element = everything[i];
				if (!accessorizeCheck.test(element.className)) {
					//Links are made blue on white, with an underline.
					for (j = 0, links.length; j < links.length; j++) {
						if (
							(element.tagName === links[j])	||
							(element.parentNode.tagName === links[j])
							) {
							element.style.backgroundColor = '#ffffff';
							element.style.color = '#0000ff';
							element.style.textDecoration = 'underline';
						}
					}
					//Content elements are made black on white.
					for (j = 0, content.length; j < content.length; j++) {
						if (element.tagName === content[j]) {
							element.style.background = '#ffffff';
							element.style.color = '#000000';
							element.style.borderRadius = '3px';
						}
					}
					//Structural elements are made white, with a faint outline.
					//Box-shadow is used instead of border, since border will
					//modify the layout.  Old IE just jusn't get this, since
					//this many filters is performance intensive.
					for (j = 0, blocks.length; j < blocks.length; j++) {
						if (element.tagName === blocks[i]) {
							element.style.background = '#ffffff';
							element.style.boxShadow = '0 0 0 1px #333333';
						}
					}
					//Lists with custom bullets are forced to look
					//high-contrast.
					for (j = 0, lists.length; j < lists.length; j++) {
						if (element.tagName === lists[j]) {
							element.style.background = '#ffffff';
							element.style.color = '#000000';
							element.style.listStyleType = 'disc';
						}
					}
				}
			}
			contrastButton.innerHTML = 'Disable High Contrast';
		};
		//End turnOnContrast

		turnOffContrast = function() {
			//For all of the elements, attempt to remove the styles we've
			//added while preserving any other inline styles added by other
			//means.  In old IE, when the style is set to '', null, or
			//undefined, it overrides the CSS with the 'none' property, which
			//isn't what we want, so we have to remove the attribute.  (Sorry
			//inline styles in old IE.)  Otherwise, unless the style was set
			//inline via the markup and was one of the styles we modified, the
			//browsers will fall back to the default site styles.  If
			//you're setting your styles inline by hand, stop it and go get a
			//stylesheet.
			for (i = 0, everything.length; i < everything.length; i++) {
				element = everything[i];
				if (
					(ieOld)	&&
					(!accessorizeCheck.test(element.className))
				   ) {
					element.removeAttribute('style');
				}
				else if (!accessorizeCheck.test(element.className)) {
					element.style.background = '';
					element.style.color = '';
					element.style.listStyleType = '';
					element.style.boxShadow = '';
					element.style.borderRadius = '';
					element.style.textDecoration = '';
				}
			}
			contrastButton.innerHTML = 'Enable High Contrast';
		};
		//End turnOnContrast

		turnOnInvert = function() {
			for (i = 0, everything.length; i < everything.length; i++) {
				element = everything[i];
				if (!accessorizeCheck.test(element.className)) {
					for (j = 0, links.length; j < links.length; j++) {
						if (
							(element.tagName === links[j])	||
							(element.parentNode.tagName === links[j])
							) {
							element.style.backgroundColor = '#000000';
							element.style.color = '#ffff00';
							element.style.textDecoration = 'underline';
						}
					}
					for (j = 0, content.length; j < content.length; j++) {
						if (element.tagName === content[j]) {
							element.style.background = '#000000';
							element.style.color = '#ffffff';
							element.style.borderRadius = '3px';
						}
					}
					for (j = 0, blocks.length; j < blocks.length; j++) {
						if (element.tagName === blocks[i]) {
							element.style.background = '#000000';
							element.style.boxShadow = '0 0 0 1px #cccccc';
						}
					}
					for (j = 0, lists.length; j < lists.length; j++) {
						if (element.tagName === lists[j]) {
							element.style.background = '#000000';
							element.style.color = '#ffffff';
							element.style.listStyleType = 'disc';
						}
					}
				}
			}
			invertButton.innerHTML = 'Revert Contrast';
		};
		//End turnOnInvert

		turnOffInvert = function() {
			for (i = 0, everything.length; i < everything.length; i++) {
					element = everything[i];
					if (
						(ieOld)	&&
						(!accessorizeCheck.test(element.className))
					   ) {
						element.removeAttribute('style');
					}
					else if (!accessorizeCheck.test(element.className)) {
						element.style.background = '';
						element.style.color = '';
						element.style.listStyleType = '';
						element.style.boxShadow = '';
						element.style.borderRadius = '';
						element.style.textDecoration = '';
					}
				}
				invertButton.innerHTML = 'Invert Contrast';
		};
		//End turnOffInvert

		turnOnFont = function() {
			for (i = 0, everything.length; i < everything.length; i++) {
				element = everything[i];

				//Old IE reports computed styles differently than modern
				//browsers.
				if (
					(ieOld) &&
					(!accessorizeCheck.test(element.className))
					) {
					//Grab out the number in the font setting.
					fontSizeMatch = parseInt((element.currentStyle.fontSize).match(/\d+/), 10);
					//Test for relative, inheriting font-sizes, and set them
					//to a default, since finding out where their inheritence
					//originates is impractical.
					if (/em|%/.test(element.currentStyle.fontSize)) {
						element.style.fontSize = '18px';
						element.style.fontFamily = 'Arial';
					}
					//If pixels or points (yuck), and less than 18 in size,
					//then make them bigger.
					if (
							(
								(/px/.test(element.currentStyle.fontSize)) &&
								(fontSizeMatch < 18)
							)	||
							(
								(/pt/.test(element.currentStyle.fontSize)) &&
								(fontSizeMatch < 18)
							)
						) {
						element.style.fontSize = '18px';
						element.style.fontFamily = 'Arial';
					}

				} else if (!accessorizeCheck.test(element.className)) {
					//Modern browsers report font size in calculated pixels,
					//unless specified as em or %.  Grab 'em out by the
					//number, test for which we have, and set accordingly.
					fontSizeMatch = parseInt((document.defaultView.getComputedStyle(element).getPropertyValue('font-size')).match(/\d+/), 10);
					if (/em|%/.test(document.defaultView.getComputedStyle(element).getPropertyValue('font-size'))) {
						element.style.fontSize = '18px';
						element.style.fontFamily = 'Arial';
					}
					if (
						(/px/.test(document.defaultView.getComputedStyle(element).getPropertyValue('font-size')))	&&
						(fontSizeMatch < 18)
						) {
						element.style.fontSize = '18px';
						element.style.fontFamily = 'Arial';
					}
					element.style.textShadow = 'none';
				}
			}
			fontBigButton.innerHTML = 'Restore Default Fonts';
		};
		//End turnOnFont

		turnOffFont = function() {
			for (i = 0, everything.length; i < everything.length; i++) {
				element = everything[i];
				//Check to see if the elements have been modified by elsewhere.
				if (
					(!accessorizeCheck.test(element.className))	&&
					(
						(contrastOn)	||
						(invertOn)
					)
					) {
					element.style.fontSize = '';
					element.style.fontFamily = '';
					element.style.textShadow = '';
				}
				//If not, then do what old IE needs, or other modern browsers
				//can support.
				else if (
					(ieOld)	&&
					(!accessorizeCheck.test(element.className))
				   ) {
					element.removeAttribute('style');
				}
				else if (!accessorizeCheck.test(element.className)) {
					element.style.fontSize = '';
					element.style.fontFamily = '';
					element.style.textShadow = '';
				}
			}
			fontBigButton.innerHTML = 'Make Fonts Easier to Read';
		};
		//End turnOffFont

		alreadyEnabled = function() {
			//Check to see if these are already enabled on another page, and
			//enable them here if they are.
			if (contrastCheck) {
				constrastOn = true;
				turnOnContrast();
			}

			if (invertCheck) {
				invertOn = true;
				turnOnInvert();
			}

			if (fontCheck) {
				fontBig = true;
				turnOnFont();
			}
		};

		//Call our functions we've defined.
		buildInterface();
		addListeners();
		alreadyEnabled();
	};
	//End accessorize

	//Mod the AJAX methods, allowing our stuff to piggyback onto AJAX calls.
	hijackXHR = function() {
		//Set to null because we'll use this to store the original functionality.
		onreadystatechange.original = null;

		//Hijack the send functionality, which should affect all AJAX calls.
		XMLHttpRequest.prototype.send = function() {
			//If the original hasn't been stored, or it doesn't equal our function
			//above, then save the original browser method and perform the
			//modification.
			if (!onreadystatechange.original || this.onreadystatechange !== onreadystatechange) {
				onreadystatechange.original = this.onreadystatechange;
				this.onreadystatechange = onreadystatechange;
			}
			//Merge our code with the constructor.
			xhrMod.apply(this, arguments);
		};

		//Calling all of the accessibility goodness on all XHR.
		XMLHttpRequest.prototype.onAfterRSCListener = function() {
			accessorize();
		};
	};

	//When everything is finished loading, fire it all off!
	//For modern browsers, we remove the listener we add later, and call the
	//main part of the script.
	if (document.addEventListener) {
		ready = function() {
			document.removeEventListener('DOMContentLoaded', ready, false);
			hijackXHR();
			accessorize();
			domainScope();
		};
	//For the old IE event model, we do the same thing.
	} else if (document.attachEvent) {
		ready = function() {
			//Make sure eager IE waits for body to exist.
			if (document.readyState === 'complete') {
				document.detachEvent('onreadystatechange', ready);
				hijackXHR();
				accessorize();
				domainScope();
			}
		};
	}

	//Modern browsers' event model.
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', ready, false);
		//Fallback to window.load, just in case.
		window.addEventListener('load', ready, false);
	//Old IE event model.
	} else if (document.attachEvent) {
		document.attachEvent('onreadystatechange', ready);
		//See fallback above.
		window.attachEvent('onload', ready);
	}

	//End!

}());