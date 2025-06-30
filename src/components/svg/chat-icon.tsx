import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

export const ChatOutlineIcon = ( { width = 24, height = 25, className = "", style = null, color = "#171B2E", ...props } ) =>
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
                d="M8.5 19.5H8C4 19.5 2 18.5 2 13.5V8.5C2 4.5 4 2.5 8 2.5H16C20 2.5 22 4.5 22 8.5V13.5C22 17.5 20 19.5 16 19.5H15.5C15.19 19.5 14.89 19.65 14.7 19.9L13.2 21.9C12.54 22.78 11.46 22.78 10.8 21.9L9.3 19.9C9.14 19.68 8.77 19.5 8.5 19.5Z"
                stroke={ color }
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.9965 11.5H16.0054"
                stroke={ color }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M11.9955 11.5H12.0045"
                stroke={ color }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7.99451 11.5H8.00349"
                stroke={ color }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export const ChatIcon = ( {
    width = 24,
    height = 25,
    className = "",
    style = null,
    ...props
} ) =>
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
            {/* Define the gradient that will fill our chat bubble */ }
            <Defs>
                <LinearGradient
                    id="paint0_linear_32_1470"
                    x1="22"
                    y1="22.5386"
                    x2="2.01"
                    y2="2.53856"
                    gradientUnits="userSpaceOnUse"
                >
                    {/* Gradient stops define the color transition from blue to cyan */ }
                    <Stop stopColor="#1584F2" />
                    <Stop offset="1" stopColor="#02AAEB" />
                </LinearGradient>
            </Defs>

            {/* Main chat bubble path with three filled dots inside */ }
            <Path
                d="M17 2.5H7C4.24 2.5 2 4.73 2 7.48V13.46V14.46C2 17.21 4.24 19.44 7 19.44H8.5C8.77 19.44 9.13 19.62 9.3 19.84L10.8 21.83C11.46 22.71 12.54 22.71 13.2 21.83L14.7 19.84C14.89 19.59 15.19 19.44 15.5 19.44H17C19.76 19.44 22 17.21 22 14.46V7.48C22 4.73 19.76 2.5 17 2.5ZM8 12.5C7.44 12.5 7 12.05 7 11.5C7 10.95 7.45 10.5 8 10.5C8.55 10.5 9 10.95 9 11.5C9 12.05 8.56 12.5 8 12.5ZM12 12.5C11.44 12.5 11 12.05 11 11.5C11 10.95 11.45 10.5 12 10.5C12.55 10.5 13 10.95 13 11.5C13 12.05 12.56 12.5 12 12.5ZM16 12.5C15.44 12.5 15 12.05 15 11.5C15 10.95 15.45 10.5 16 10.5C16.55 10.5 17 10.95 17 11.5C17 12.05 16.56 12.5 16 12.5Z"
                fill="url(#paint0_linear_32_1470)"
            />
        </Svg>
    );
};
