<template>
<!--
  This code is written by ASDAFF
  The original code on codepen: https://codepen.io/ASDAFF/pen/YVdGJb
  All copy right recivied for ASDAFF
  finally, thanks to ASDAFF for such an amazing loader
-->
<main class="main container">
    <div class="col col--full">
        <div class="loader">
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
            <div class="hex"></div>
        </div>
    </div>
</main>
</template>

<style lang="scss">
/**
  This code is written by ASDAFF
  The original code on codepen: https://codepen.io/ASDAFF/pen/YVdGJb
  All copy right recivied for ASDAFF
  finally, thanks to ASDAFF for such an amazing loader
*/

// Settings
$hex-rows: 7; // More elements will need to be added if > 11
$hex-size: 10px;
$hex-gap: $hex-size*0.25;
$hex-color: #e60099;
$hex-animation-type: left-right; // none|top-bottom|left-right
// TODO: center-out|out-center

// ------------------------------------------------------

@function random-color($min: 0, $max: 255, $alpha: 1, $red: null, $green: null, $blue: null) {
    @if $min < 0 {
        $min: -1;
    } @else {
        $min: $min - 1;
    }
    @if $max > 255 {
        $max: 256;
    } @else {
        $max: $max + 1;
    }

    $range: $max - $min;
    @if not $red { $red: random($range) + $min; }
    @if not $green { $green: random($range) + $min; }
    @if not $blue { $blue: random($range) + $min; }

    @return rgba($red, $green, $blue, $alpha);
}

// Colors
$primary: random-color($min: 100, $max:200);
$primary-light: lighten($primary, 15%);
$primary-dark: darken($primary, 15%);
$black: #333333;
$white: #eeeeee;

// Fonts
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400|Raleway:300);
$open-sans: 'Open Sans', Helvetica, arial, sans-serif;
$raleway: 'Raleway', 'Open Sans', sans-serif;

// Misc
$max-width: 800px;

// ------------------------------------------------------

img {
    max-width: 100%;
}

.header {
    position: relative;
    overflow: visible;
    &:after {
        box-sizing: border-box;
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 50px;
        height: 2px;
        background-color: $primary;
        transform: translateX(-50%);
    }
}

.pen__heading {}

.pen__subheading {
    margin-bottom: 0;
    a {
        color: $primary;
        &:hover,
        &:focus {
            color: $primary-light;
        }
    }
}

.container {
    overflow: hidden;
    width: 100%;
    // max-width: $max-width;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.col {
    padding: 1rem;
    @media (min-width: $max-width) {
        width: 50%;
        float: left;

        &:nth-of-type(2n+1) {
            clear: left;
        }
    }
    &.col--full {
        width: 100%;
    }
}
// ------------------------------------------------------
// Other
$hex-color: $primary !default;
$ratio: if($hex-size/1px < 35, 0.6, 0.57735);
$hex-width: $hex-size;
$hex-height: $hex-size*$ratio*2;

.loader {
    position: relative;
    width: $hex-width*$hex-rows + ($hex-gap*($hex-rows - 1));
    height: $hex-width*$hex-rows + (($hex-gap/2)*($hex-rows - 1));
    margin: 0 auto;
}

.hex {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    width: $hex-width;
    height: $hex-height/2;
    color: $hex-color;
    background-color: currentColor;
    transform: translate(-50%, -50%);
    transform-origin: 0 0;

    &:before,
    &:after {
        box-sizing: border-box;
        content: '';
        position: absolute;
        width: $hex-width;
        height: $hex-height/2;
        background-color: currentColor;
        // box-shadow: 0px 0px 0px 1px #000 inset;
    }
    &:before { transform: rotate(60deg); box-sizing: border-box; }
    &:after { transform: rotate(-60deg); box-sizing: border-box; }

    $x-dist: $hex-width + $hex-gap;
    $y-dist: $hex-height + $hex-gap;
    $el: 1;
    $cols: floor($hex-rows/2);
    $even-cols: if($cols % 2 == 0, true, false);
    $x-offset: if($even-cols, -($cols/2) + 0.5, -(($cols - 1)/2));
    $y-offset: -(($hex-rows - 1)/2);
    @for $r from 0 through ($hex-rows - 1) {
        // Are we still above the middle row?
        @if $y-offset <= 0 {
            $cols: $cols + 1;
            $x-offset: $x-offset - 0.5;
        } @else {
            $cols: $cols - 1;
            $x-offset: $x-offset + 0.5;
        }
        $even-cols: if($cols % 2 == 0, true, false);
        $row-x-offset: $x-offset;
        @for $c from 1 through $cols {
            &:nth-of-type(#{$el}) {
                display: block;
                // Update the position
                margin-left: $row-x-offset * ($x-dist);
                margin-top: $y-offset * ($y-dist*0.75);
                @if $hex-animation-type != none {
                    animation: scaleIt 1.5s ease-in-out infinite both;
                }
                // Should we animate?
                @if $hex-animation-type == top-bottom {
                    animation-delay: 0.05*$r*1s;
                } @else if $hex-animation-type == left-right {
                    animation-delay: 0.05*($c - 1)*1s;
                } @else if $hex-animation-type == in-out {
                    // animation: scaleIt 2s ease-in-out infinite both 0.05*($c - 1)*1s;
                } @else if $hex-animation-type == out-in {
                    // animation: scaleIt 2s ease-in-out infinite both 0.05*($c - 1)*1s;
                }
            }
            // Next element
            $el: $el + 1;
            // Increase x-offset but make sure we only use 0 if uneven columns
            $row-x-offset: if($even-cols and $row-x-offset + 1 == 0, 1, $row-x-offset + 1);
        }
        // Update the y-offset
        $y-offset: $y-offset + 1;
    }
}

@keyframes scaleIt {
    25%,100% {
        transform: scale(1)
                   translate(-50%, -50%);
    }
    50% {
        transform: scale(0)
                   translate(-50%, -50%);
    }
}
</style>
