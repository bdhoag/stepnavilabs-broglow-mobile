import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

const CrownIcon = ( { width = 20, height = 19, className = "", style = null, fill = null, ...props } ) =>
{
    return (
        <Svg
            width={ width }
            height={ height }
            viewBox="0 0 20 19"
            fill="none"
            className={ className }
            style={ style }
            { ...props }
        >
            <Defs>
                <LinearGradient
                    id="paint0_linear_32_1082"
                    x1="14.5521"
                    y1="17.4195"
                    x2="14.2475"
                    y2="15.0842"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#FF1843" stopOpacity="0.9" />
                    <Stop offset="1" stopColor="#FF5E7C" stopOpacity="0.9" />
                </LinearGradient>
                <LinearGradient
                    id="paint1_linear_32_1082"
                    x1="17.8577"
                    y1="15.058"
                    x2="4.78471"
                    y2="-0.437713"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#FF1843" stopOpacity="0.9" />
                    <Stop offset="1" stopColor="#FF5E7C" stopOpacity="0.9" />
                </LinearGradient>
            </Defs>
            <Path
                d="M13.9583 17.4166H6.04167C5.71709 17.4166 5.44792 17.1475 5.44792 16.8229C5.44792 16.4983 5.71709 16.2291 6.04167 16.2291H13.9583C14.2829 16.2291 14.5521 16.4983 14.5521 16.8229C14.5521 17.1475 14.2829 17.4166 13.9583 17.4166Z"
                fill={ fill || "url(#paint0_linear_32_1082)" }
            />
            <Path
                d="M16.6106 4.36999L13.4439 6.63416C13.0243 6.93499 12.4227 6.75291 12.2406 6.26999L10.7443 2.27999C10.491 1.59124 9.51726 1.59124 9.26392 2.27999L7.75976 6.26207C7.57767 6.75291 6.98392 6.93499 6.56434 6.62624L3.39767 4.36207C2.76434 3.91874 1.92517 4.54416 2.18642 5.28041L5.47976 14.5033C5.59059 14.82 5.89142 15.0258 6.22392 15.0258H13.7685C14.101 15.0258 14.4018 14.8121 14.5127 14.5033L17.806 5.28041C18.0752 4.54416 17.236 3.91874 16.6106 4.36999ZM11.9793 11.6771H8.02101C7.69642 11.6771 7.42726 11.4079 7.42726 11.0833C7.42726 10.7587 7.69642 10.4896 8.02101 10.4896H11.9793C12.3039 10.4896 12.5731 10.7587 12.5731 11.0833C12.5731 11.4079 12.3039 11.6771 11.9793 11.6771Z"
                fill={ fill || "url(#paint1_linear_32_1082)" }
            />
        </Svg>
    )
}

export default CrownIcon