import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

export const HomeOutlineIcon = ( { width = 24, height = 25, className = "", style = null, color = "#171B2E", ...props } ) =>
{
    return (
        <Svg
            width={ width }
            height={ height }
            viewBox="0 0 24 25"
            fill="none"
            className={ className }
            style={ style }
            { ...props }
        >
            <Path
                d="M12 18.5V15.5"
                stroke={ color }
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M10.07 3.32009L3.14 8.87009C2.36 9.49009 1.86 10.8001 2.03 11.7801L3.36 19.7401C3.6 21.1601 4.96 22.3101 6.4 22.3101H17.6C19.03 22.3101 20.4 21.1501 20.64 19.7401L21.97 11.7801C22.13 10.8001 21.63 9.49009 20.86 8.87009L13.93 3.33009C12.86 2.47009 11.13 2.47009 10.07 3.32009Z"
                stroke={ color }
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export const HomeIcon = ( { width = 24, height = 25, style = null, ...props } ) =>
{
    return (
        <Svg
            width={ width }
            height={ height }
            viewBox="0 0 24 25"
            fill="none"
            style={ style }
            { ...props }
        >
            <Defs>
                <LinearGradient
                    id="paint0_linear_32_1231"
                    x1="22.1731"
                    y1="22.5486"
                    x2="2.176"
                    y2="2.20853"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#1584F2" />
                    <Stop offset="1" stopColor="#02AAEB" />
                </LinearGradient>
            </Defs>
            <Path
                d="M20.83 8.51002L14.28 3.27002C13 2.25002 11 2.24002 9.73 3.26002L3.18 8.51002C2.24 9.26002 1.67 10.76 1.87 11.94L3.13 19.48C3.42 21.17 4.99 22.5 6.7 22.5H17.3C18.99 22.5 20.59 21.14 20.88 19.47L22.14 11.93C22.32 10.76 21.75 9.26002 20.83 8.51002ZM12.75 18.5C12.75 18.91 12.41 19.25 12 19.25C11.59 19.25 11.25 18.91 11.25 18.5V15.5C11.25 15.09 11.59 14.75 12 14.75C12.41 14.75 12.75 15.09 12.75 15.5V18.5Z"
                fill="url(#paint0_linear_32_1231)"
            />
        </Svg>
    );
};