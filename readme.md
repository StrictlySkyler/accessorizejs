<!doctype html>
<!--[if lt ie 7]><html lang="en" class="ie ie6 ielte9 ielte8 ielte7 ielte6"> <![endif]-->
<!--[if ie 7]> <html lang="en" class="ie ie7 ielte9 ielte8 ielte7"> <![endif]-->
<!--[if ie 8]> <html lang="en" class="ie ie8 ielte9 ielte8"> <![endif]-->
<!--[if ie 9]> <html lang="en" class="ie ie9 ielte9"> <![endif]-->
<!--[if gt ie 9]> <html lang="en" class="ie"> <![endif]-->
<!--[if !ie]><!--> <html lang="en"> <!--<![endif]-->
	<head>
		<meta charset="utf-8" />
		<title>accessorize.js</title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<link rel="stylesheet" type="text/css" href="accessorize.css" />
	</head>
	<body>

		<button id="accessorize" class="accessorizeNode floating-tab">accessorize me!</button>

		<div id="content" class="content">
			<div id="header" class="header">
				<h1>accessorize.js</h1>
				<h2>Making the Web Accessible for Everyone</h2>
			</div>

			<div id="main" class="main">
				<h3>In A Nutshell</h3>
				<p><span>Accessorize.js</span> is a JavaScript library meant to help make the web more accessible to people who have visual impairments, or are legally blind.  It currently provides an interface to enable different methods of high-contrast viewing on a site, similar to methods available on modern day computer operating systems.</p>
				<p>The ultimate goal of <span>accessorize.js</span> is to become a turnkey solution to help web developers make sites that are WCAG 2.0 AA compliant <strong><em>without</em></strong> sacrificing the awesome presentational stuff that came about with the rise of Web 2.0 (and beyond).</p>

				<h3>How It Works</h3>
				<p>To use <span>accessorize.js</span>, include it into the markup of a webpage -- preferably just before the end of the <code>&lt;body&gt;</code> tag.  Then, add a button or a link elsewhere with the <code>"accessorize"</code> id and the <code>"accessorizeNode"</code> class.  (Any element with the <code>accessorizeNode</code> class will be ignored when the library modifies the styles on the page.)</p>
				<p>When the element with the <code>accessorize</code> id is clicked, it will provide an overlay to enable or disable various viewing modes aimed at making websites easier to read for people with vision impairment.</p>
				<p>Right now, the options available are:</p>
				<ul id="options-list">
					<li>High Contrast</li>
					<li>Inverted Contrast</li>
					<li>Increased Font Size</li>
				</ul>
				<p>Down the road, the following features are planned for implementation:</p>
				<ul class="options-list">
					<li>Adding WAI-ARIA Roles</li>
					<li>Checking to see if there are any <code>&lt;img&gt;</code> elements without <code>alt</code> attributes</li>
					<li>Catching links and content that makes no sense when taken out of context</li>
					<li>Expose the ability to trigger the library from other scripts</li>
					<li>Anything else I haven't thought of!</li>
				</ul>
				<p>Enabling <span>"High Contrast"</span> attempts to turn all of the textual content on a site black in color with a white background, turn links and buttons blue with an underline, and to outline many structural block-level elements with a minimal shadow.</p>
				<p>The <span>"Invert Contrast"</span> feature works just like the High Contrast feature, except that the content turns white with a black background, and the links turn yellow.</p>
				<p>Both modes attempt to normalize images used as bullets for lists.</p>
				<p><span>"Make Fonts Easier to Read"</span> attempts to increase the size of any fonts below 18px to 18px, change the font to Arial, and remove any text-shadows which might be applied.</p>
				<p>Disabling any of the above features attempts to restore the default state declared in a stylesheet or embedded <code>&lt;style&gt;</code> tag.</p>
				<p>Elements added to the DOM via AJAX should be covered automatically.</p>
				<h3>Check Out The Source</h3>
				<p>You can find the source code here: <a href="https://github.com/StrictlySkyler/accessorizejs/blob/master/accessorize.js" target="_blank">accessorize.js on github</a></p>
				<p>Give it a download, a fork, or some feedback if you'd like.  It's much appreciated.</p>
				<h3>Licensing</h3>
				<p><span>Accessorize.js</span> is licensed under the <a href="http://www.gnu.org/copyleft/gpl.html" target="_blank">GPL 3.0</a>.  Let's keep the Web for everyone.
			</div>

			<div id="footer" class="footer">
				<p>Created by Skyler Brungardt & Jeff Ritenburg &ndash; 2011</p>
			</div>
		</div>


		<script type="text/javascript" src="accessorize.js"></script>

	</body>
</html>
