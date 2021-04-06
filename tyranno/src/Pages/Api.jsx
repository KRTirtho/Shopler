import React from 'react'
import "./css/Api.css"

/**
 * @typedef Its_a_file_used_as_a_display_only_file
  */

function Api() {

    return (
        <div className="container-fluid margin-adjust">
            <h1>Tiny CSS</h1>
            <p>A simple, tiny, long-typed CSS3 framework built with the inspiration from Legendary Bootstrap CSS & a bit from Respective Tailwind CSS.</p>
            <br/>
            <p>It uses CSS classes to style elements similar to Bootstrap & Tailwind CSS but also uses <b>data-</b> attributes to determine the Shade of the Document. The main attraction of it, is it's __Dark-Mode__ prioritized approach. <b>data-shade="dark"</b> is used to check if the Element is in dark mode or not. With the help of Javascript anyone can Easily toggle the <b>dark mode</b> of the targeted Element. But for enabling <span style={{color: "orangered"}}>Dark-Mode Convert-able DOM or <b style={{color:"cornflowerblue"}}>DMC-DOM</b></span> feature it is important to specify it's class with <code>`.container`</code>. Then the JavaScript module can easily understand which is _DMC-DOM_.</p>
            <br/>
            <div>
                <p>Another great approach of it is that it is built on top of the modern CSS3 that means instead of using</p>
                <ul>
                    <li>Flexbox</li>
                    <li>no-Variable base</li>
                </ul>
                <p>It uses the modern & developers favorite</p>
                <ul>
                    <li>CSS3 Variables</li>
                    <li>CSS Grid</li>
                    <li>HTML5 <b>data-</b> attributes</li>
                </ul>
            </div>
            <br/>
            <p><em>But all of this with all similar classnames of Bootstrap. It uses CSS3 variables for customizing the Document. It has a separated Theme.css file that is imported by all other piece of files. Developers can change the colors, dimensions, transition-duration etc.</em> Then they can save the file & give it a new flavor without writing all the code form scratch. Only con of this Library is that it has a poor positioning system but don't worry it's only the <b>start</b>.  I'm trying to find other developers who can help me in this situation. I promise the positioning will be strong enough in the next major update.</p>
            <br/>
            <p>I'll give you all the examples & classes in my Official Tiny-CSS WebPage. You'll find it really handy... </p>
            <br/>
            <br/>
            <h5>Well, though I said that all documentation will be found in my Official Tiny-CSS WebPage but for giving a little taste of this projects I have given some examples below.</h5>
            <br/>
            <pre lang="html">
{`<div data-shade="light" id="semi-div" class="semi-div container-div vertical-center text-align-justify">
<h1>Semi Div</h1>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio qui facere eveniet, eligendi explicabo similique
molestiae laudantium voluptate repudiandae quam relit architects, nullo eos quae expedite total aspernatur quia
official nebo fugit. Doloremque selectus eum ipsum officio, repudiandae
possums?</p>
</div>`}
            </pre>
            <br/>
            <p>Here <code lang="html">class="semi-div"</code> is a Simple div container with the width of 90% & <code lang="css">.container-div</code> is used for applying a minimal  <code lang ='css'>background-color</code> to any div element.Attribute <code lang="html">data-shade="light"</code> is not important but for better readability you can use it but if you use javascript and set the attribute to dark it won't create a issue because it creates a new <b>data-shade</b> attribute for that particular element <code lang="html">text-align-justify</code> & <code lang="html">vertical-center</code> are some utility classes for Justifying the text & center the corresponding element  vertically. Id is important because you have to select the element & then change the mode, right?</p>
            <br/>
            <br/>
            <p>Look at the javascript code & you will get an idea of how to create the <i>dark-mode</i> toggle btn. But  let's add a toggle button first</p>
            <br/>
            <pre lang="html">{`<button id="toggle" class="btn" style="position: 
             fixed; left: 0; top: 50%;">Dark</button>`}</pre>
             <br/>
             <p>Now, <b>Javascript</b></p>
             <br/>
             <pre lang="javascript">
                {`function $(el) {
return document.getElementById(el);
}
let toggleBtn = $("toggle");
let semiDiv = $("semi-div");

function toggleDarkMode(e){
if (!semiDiv.getAttribute("data-shade")){
    semiDiv.setAttribute("data-shade", "dark");
}
else{
    semiDiv.removeAttribute("data-shade");
}
}

toggleBtn.addEventListener("click", toggleDarkMode)`}
             </pre>
             <br/>
             <p>Don't worry if you are terrified seeing that you have to write <code lang="javascript">setAttribute(), getAttribute() & removeAttribute()</code> so many times. You can use a <code lang="javascript">for</code> loop or a high-order array function (like <code lang="javascript">array.prototype.forEach()</code>) to fix this issue... Let me give an example for it  --&gt;</p>
             <pre lang="javascript">
                 {`let container = document.querySelectorAll(".container");

const toggleDarkMode=(e)=>{
container.forEach(DMC=>{
    if(!DMC.getAttribute("data-shade")){   /* Checking if data-shade is present or not*/
    DMC.setAttribute("data-shade", "dark")  /* applying & creating data-shade="dark" */
    }
    else if(d.getAttribute("data-shade")==="light"){ /* Checking  if it's default to "light" or not*/
    DMC.setAttribute("data-shade", "dark") /* applying data-shade="dark" */
    }
    else{
    DMC.removeAttribute("data-shade") //If neither of those returns true we Remove the attribute
    }
})
    
}

toggleBtn.addEventListener("click", toggleDarkMode);`}
            </pre>
            <br/>
            <br/>
            <p className="text-align-center">For more information stay with me & follow me on <a href="https://twitter.com/@krtirtho" target="_blank" rel="noopener noreferrer">Twitter</a> & <a href="https://facebook.com/krtirtho" target="_blank" rel="noopener noreferrer">Facebook</a></p>
        </div>
    )
}

export default Api















