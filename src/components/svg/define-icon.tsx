import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

const DefineIcon = ( { width = 18, height = 18, className = "", style = null, fill = null, ...props } ) =>
{
    return (
        <Svg
            width={ width }
            height={ height }
            viewBox="0 0 18 18"
            fill="none"
            className={ className }
            style={ style }
            { ...props }
        >
            <Defs>
                <LinearGradient
                    id="paint0_linear_32_1030"
                    x1="17.0626"
                    y1="17.1017"
                    x2="0.937572"
                    y2="0.976672"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#1584F2" />
                    <Stop offset="1" stopColor="#02AAEB" />
                </LinearGradient>
            </Defs>
            <Path
                d="M16.5001 8.4375H14.9701C14.7001 5.58 12.4201 3.2925 9.56257 3.03V1.5C9.56257 1.1925 9.30757 0.9375 9.00007 0.9375C8.69257 0.9375 8.43757 1.1925 8.43757 1.5V3.03C5.58007 3.3 3.29257 5.58 3.03007 8.4375H1.50007C1.19257 8.4375 0.937572 8.6925 0.937572 9C0.937572 9.3075 1.19257 9.5625 1.50007 9.5625H3.03007C3.30007 12.42 5.58007 14.7075 8.43757 14.97V16.5C8.43757 16.8075 8.69257 17.0625 9.00007 17.0625C9.30757 17.0625 9.56257 16.8075 9.56257 16.5V14.97C12.4201 14.7 14.7076 12.42 14.9701 9.5625H16.5001C16.8076 9.5625 17.0626 9.3075 17.0626 9C17.0626 8.6925 16.8076 8.4375 16.5001 8.4375ZM9.00007 11.34C7.71007 11.34 6.66007 10.29 6.66007 9C6.66007 7.71 7.71007 6.66 9.00007 6.66C10.2901 6.66 11.3401 7.71 11.3401 9C11.3401 10.29 10.2901 11.34 9.00007 11.34Z"
                fill={ fill || "url(#paint0_linear_32_1030)" }
            />
        </Svg>

    )
}

export default DefineIcon