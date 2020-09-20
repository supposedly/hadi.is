// SCSS RFS mixin - converted to JS
//
// Automated responsive values for font sizes, paddings, margins and much more
//
// Licensed under MIT (https://github.com/twbs/rfs/blob/master/LICENSE):
//
// MIT License
//
// Copyright (c) 2017-2019 Martijn Cuppens
// Copyright (c) 2020 Hadi Tarhini
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function typeOf(val) {
  if (Array.isArray(val)) {
    return `array`;
  }
  if (typeof val === `number`) {
    return `number`;
  }
  if (typeof val === `string`) {
    return /-?^(\.\d+|\d+(\.\d+)?)([a-z]+)?$/.test(val) ? `number` : `string`;
  }
  //TODO: color names i guess eugh
  return typeof val;
}

function unit(val) {
  return /[a-z]+$/.exec(val)[0];
}

function unitless(val) {
  return +/(-?^(\.\d+|\d+(\.\d+)?))([a-z]+)?$/.exec(val)[1];
}

function abs(val) {
  if (typeof val === `string`) {
    let matches = /-?^(\.\d+|\d+(\.\d+)?)([a-z]+)?$/.exec(val);
    return `${+matches[1]}${matches[2]}`;
  }
  return Math.abs(+val);
}

// dedent
// XXX: too much regex lol
function dd(strings, ...keys) {
  let str = strings;
  if (Array.isArray(str)) {
    str = str.reduce(
      (acc, cur, idx) => acc ? `${acc}${keys[idx-1]}${cur}` : `${cur}${keys[idx-1]}`
    );
  }
  const lines = str.split(`\n`);
  const includeFirstLine = /\S/.test(lines[0]);
  const includeLastLine = /\S/.test(lines[lines.length - 1]);
  const leastCommonIndent = new RegExp(
    // `${includeFirstLine ? `^` : `\\n`}(\\s*)(?:.*?\\n(?:(?=\\n)|\\1)){${lines.length - 1 - !includeFirstLine - !includeLastLine}}`
    // 2 by default bc ignoring first line too
    `\\n(\\s*)(?:.*?\\n(?:(?=\\n)|\\1)){${lines.length - 2 - !includeLastLine}}`
  ).exec(str)[1].length;
  // return lines.slice(!includeFirstLine, includeLastLine ? undefined : -1)
  const ret = lines
    .slice(1, includeLastLine ? undefined : -1)
    .map(s => s.slice(leastCommonIndent))
    .join('\n');
  return includeFirstLine ? `${lines[0]}\n${ret}` : ret;
}

const defaultArgs = {
  $rfsBaseValue: `1.25rem`, // ends up unitless!!
  $rfsUnit: `rem`,
  $rfsBreakpoint: `1200px`, // ends up unitless!!
  $rfsBreakpointUnit: `px`,
  $rfsTwoDimensional: false,
  $rfsFactor: 10,
  $rfsMode: `min-media-query`,
  $rfsClass: false,
  $rfsRemValue: 16,
  $rfsSafariIframeResizeBugFix: false,
  $enableRfs: true
}

export default class RFS {
  // Configuration
  constructor(args) {
    args = {...defaultArgs, ...args}
    // Base value
    this.$rfsBaseValue = args.$rfsBaseValue;
    this.$rfsUnit = args.$rfsUnit;

    if (this.$rfsUnit !== `rem` && this.$rfsUnit !== `px`) {
      throw new Error(`\`${args.$rfsUnit}\` is not a valid unit for $rfs-unit. Use \`px\` or \`rem\`.`);
    }

    // Breakpoint at where value-s start decreasing if screen width is smaller
    this.$rfsBreakpoint = args.$rfsBreakpoint;
    this.$rfsBreakpointUnit = args.$rfsBreakpointUnit;

    if (this.$rfsBreakpointUnit !== `px` && this.$rfsBreakpointUnit !== `em` && this.$rfsBreakpointUnit !== `rem`) {     
      throw new Error(`\`${this.$rfsBreakpointUnit}\` is not a valid unit for $rfsBreakpointUnit. Use \`px\`, \`em\` or \`rem\`.`);
    }

    // Resize values based on screen height and width
    this.$rfsTwoDimensional = args.$rfsTwoDimensional;

    // Factor of decrease
    this.$rfsFactor = args.$rfsFactor;

    if (typeOf(this.$rfsFactor) !== `number` || this.$rfsFactor <= 1) {
      throw new Error(`\`${this.$rfsFactor}\` is not a valid  $rfsFactor, it must be greater than 1.`);
    }

    // Mode. Possibilities: `min-media-query`, `max-media-query`
    this.$rfsMode = args.$rfsMode;

    // Generate enable or disable classes. Possibilities: false, `enable` or `disable`
    this.$rfsClass = args.$rfsClass;

    // 1 `rem` = args.$rfs-rem-value `px`
    this.$rfsRemValue = args.$rfsRemValue;

    // Safari iframe resize bug: https://github.com/twbs/rfs/issues/14
    this.$rfsSafariIframeResizeBugFix = args.$rfsSafariIframeResizeBugFix;

    // Disable RFS by setting $enableRfs to false
    this.$enableRfs = args.$enableRfs;

    // Cache $rfs-base-value unit
    this.$rfsBaseValueUnit = unit(this.$rfsBaseValue);

    // Remove `px`-unit from $rfs-base-value for calculations
    this.$rfsBaseValue = unitless(this.$rfsBaseValue);
    if (this.$rfsBaseValueUnit === `rem`) {
      this.$rfsBaseValue *= this.$rfsRemValue;
    }

    // Cache $rfs-breakpoint unit to prevent multiple calls
    this.$rfsBreakpointUnitCache = unit(this.$rfsBreakpoint);

    // Remove unit from $rfs-breakpoint for calculations
    this.$rfsBreakpoint = unitless(this.$rfsBreakpoint);
    if (this.$rfsBreakpointUnitCache === `rem`) {
      this.$rfsBreakpoint *= this.$rfsRemValue;
    }

    // Calculate the media query value
    this.$rfsMqValue = this.$rfsBreakpointUnit === `px` ? `${this.$rfsBreakpoint}px` : `${this.$rfsBreakpoint / this.$rfsRemValue}${this.$rfsBreakpointUnit}`;
    this.$rfsMqPropertyWidth = this.$rfsMode === `max-media-query` ? `max-width` : `min-width`;
    this.$rfsMqPropertyHeight = this.$rfsMode === `max-media-query` ? `max-height` : `min-height`;
  }

  // Internal mixin used to determine which media query needs to be used
  _rfsMediaQuery($content) {
    if (this.$rfsTwoDimensional) {
      if (this.$rfsMode === `max-media-query`) {
        return dd`
          @media (${this.$rfsMqPropertyWidth} = ${this.$rfsMqValue}), (${this.$rfsMqPropertyHeight} = ${this.$rfsMqValue}) {
            ${$content}
          }
        `
      }
      else {
        return dd`
          @media (${this.$rfsMqPropertyWidth} = ${this.$rfsMqValue}) and (${this.$rfsMqPropertyHeight} = ${this.$rfsMqValue}) {
            ${$content}
          }
        `
      }
    }
    else {
      return dd`
        @media (${this.$rfsMqPropertyWidth} = ${this.$rfsMqValue}) {
          ${$content}
        }
      `
    }
  }

  // Internal mixin that adds disable classes to the selector if needed.
  _rfsRule($content) {
    if (this.$rfsClass === `disable` && this.$rfsMode === `max-media-query`) {
      // Adding an extra class increases specificity, which prevents the media query to override the property
      return dd`
        &,
        .disable-rfs &,
        &.disable-rfs {
          ${$content}
        }
      `
    }
    else if (this.$rfsClass === `enable` && this.$rfsMode === `min-media-query`) {
      return dd`
        .enable-rfs &,
        &.enable-rfs {
          ${$content}
        }
      `
    }
    else {
      return $content;
    }
  }

  // Internal mixin that adds enable classes to the selector if needed.
  _rfsMediaQueryRule($content) {
    let ret = [];

    if (this.$rfsClass === `enable`) {
      if (this.$rfsMode === `min-media-query`) {
        ret.push($content);
      }

      ret.push(this._rfsMediaQuery(dd`
        {
          .enable-rfs &,
          &.enable-rfs {
            ${$content}
          }
        }
      `));
    }
    else {
      if (this.$rfsClass === `disable` && this.$rfsMode === `min-media-query`) {
        ret.push(dd`
          .disable-rfs &,
          &.disable-rfs {
            ${$content}
          }
        `);
      }
      ret.push(this._rfsMediaQuery($content));
    }

    return ret.join('\n');
  }

  // Helper function to get the formatted non-responsive value
  rfsValue($values) {
    // Convert to list
    $values = typeOf($values) !== `array` ? [...$values] : $values;

    let $val = '';

    // Loop over each value and calculate value
    $values.forEach($value => {
      if ($value === 0) {
        $val = `${$val} 0`;
      }
      else {
        // Cache $value unit
        let $unit = typeOf($value) === `number` ? unit($value) : false;

        if ($unit === `px`) {
          // Convert to `rem` if needed
          $val = `${$val}  ${this.$rfsUnit === `rem` ? `${(unitless($value) + this.$rfsRemValue)}rem` : $value}`;
        }
        else if ($unit === `rem`) {
          // Convert to `px` if needed
          $val = `${$val} ${this.$rfsUnit === `px` ? `${unitless($value) * this.$rfsRemValue}px` : $value}`;
        }
        else {
          // If $value isn't a number (like inherit) or $value has a unit (not `px` or `rem`, like 1.5em) or $ is 0, just print the value
          $val = `${$val} ${$value}`;
        }
      }
    });

    // Remove first space (UNNEEDED IN JS i think)
    // return unquote(strSlice($val, 2));
    return $val.slice(1);
  }

  // Helper function to get the responsive value calculated by RFS
  rfsFluidValue($values) {
    // Convert to list
    $values = typeOf($values) !== `array` ? [...$values] : $values;

    let $val = '';

    // Loop over each value and calculate value
    $values.forEach($value => {
      if ($value === 0) {
        $val = $val + ' 0';
      }

      else {
        // Cache $value unit
        let $unit = typeOf($value) === `number` ? unit($value) : false;

        // If $value isn't a number (like inherit) or $value has a unit (not `px` or `rem`, like 1.5em) or $ is 0, just print the value
        if (!$unit || ($unit !== `px` && $unit !== `rem`)) {
          $val = `${$val} ${$value}`;
        }
        else {
          // Remove unit from $value for calculations
          $value = unitless($value);
          if ($unit !== `px`) {
            $value *= this.$rfsRemValue;
          }

          // Only add the media query if the value is greater than the minimum value
          if (abs($value) <= this.$rfsBaseValue || !this.$enableRfs) {
            $val = `${$val} ${this.$rfsUnit === `rem` ? `${$value / this.$rfsRemValue}rem` : `${$value}px`}`;
          }
          else {
            // Calculate the minimum value
            let $valueMin = this.$rfsBaseValue + (abs($value) - this.$rfsBaseValue) / this.$rfsFactor;

            // Calculate difference between $value and the minimum value
            let $valueDiff = abs($value) - $valueMin;

            // Base value formatting
            let $minWidth = this.$rfsUnit === `rem` ? `${$valueMin / this.$rfsRemValue}rem` : `${$valueMin}px`;
            // Use negative value if needed
            $minWidth = $value < 0 ? `-${$minWidth}` : $minWidth;
            if ($minWidth.startsWith('--')) {
              $minWidth = $minWidth.slice(2);
            }

            // Use `vmin` if two-dimensional is enabled
            let $variableUnit = this.$rfsTwoDimensional ? `vmin` : `vw`;

            // Calculate the variable width between 0 and $rfs-breakpoint
            let $variableWidth = `${$valueDiff * 100 / this.$rfsBreakpoint}${$variableUnit}`;

            // Return the calculated value
            $val = `${$val} calc(${$minWidth} ${$value < 0 ? '-' : '+'} ${$variableWidth})`;
          }
        }
      }
    });

    // Remove first space (UNNEEDED IN JS i think)
    // return unquote(strSlice($val, 2));
    return $val.slice(1);
  }

  // RFS mixin
  _rfs($values, $property = `font-size`) {
    if (!Array.isArray($values)) {
      $values = [$values];
    }
    if ($values !== null) {
      let $val = this.rfsValue($values);
      let $fluidVal = this.rfsFluidValue($values);

      // Do not print the media query if responsive & non-responsive values are the same        
      if ($val === $fluidVal) {
        return `${$property}: ${$val}`;
      }
      else {
        return dd`
        ${this._rfsRule(dd`
          ${$property}: ${this.$rfsMode === `max-media-query` ? $val : $fluidVal};
          ${this.$rfsSafariIframeResizeBugFix ? `min-width: (0 * 1vw);` : ``}
        `)}

        ${this._rfsMediaQueryRule(dd`
          ${$property}: ${this.$rfsMode === `max-media-query` ? $fluidVal : $val};
        `)}
      `
      }
    }
  }

  rfs(...args) {
    return this._rfs(...args).trim();
  }

  // Shorthand helper mixins
  fontSize(...$values) {
    return this.rfs($values);
  }

  padding(...$values) {
    return this.rfs($values, `padding`);
  }

  paddingTop(...$values) {
    return this.rfs($values, `padding-top`);
  }

  paddingRight(...$values) {
    return this.rfs($values, `padding-right`);
  }

  paddingBottom(...$values) {
    return this.rfs($values, `padding-bottom`);
  }

  paddingLeft(...$values) {
    return this.rfs($values, `padding-left`);
  }

  margin(...$values) {
    return this.rfs($values, `margin`);
  }

  marginTop(...$values) {
    return this.rfs($values, `margin-top`);
  }

  marginRight(...$values) {
    return this.rfs($values, `margin-right`);
  }

  marginBottom(...$values) {
    return this.rfs($values, `margin-bottom`);
  }

  marginLeft(...$values) {
    return this.rfs($values, `margin-left`);
  }
}
