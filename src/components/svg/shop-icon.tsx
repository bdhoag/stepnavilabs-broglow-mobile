import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

export const ShopOutlineIcon = ( { width = 24, height = 25, className = "", style = null, color = "#171B2E", ...props } ) =>
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
                d="M7.5 8.17001V7.20001C7.5 4.95001 9.31 2.74001 11.56 2.53001C14.24 2.27001 16.5 4.38001 16.5 7.01001V8.39001"
                stroke={ color }
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M9.00001 22.5H15C19.02 22.5 19.74 20.89 19.95 18.93L20.7 12.93C20.97 10.49 20.27 8.5 16 8.5H8.00001C3.73001 8.5 3.03001 10.49 3.30001 12.93L4.05001 18.93C4.26001 20.89 4.98001 22.5 9.00001 22.5Z"
                stroke={ color }
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15.4955 12.5H15.5045"
                stroke={ color }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M8.49451 12.5H8.50349"
                stroke={ color }
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export const ShopIcon = ( { width = 24, height = 25, className = "", style = null, color = "#171B2E", ...props } ) =>
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
            <Defs>
                <LinearGradient
                    id="paint0_linear_35_4353"
                    x1="20.8419"
                    y1="22.5485"
                    x2="0.990199"
                    y2="4.99625"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#1584F2" />
                    <Stop offset="1" stopColor="#02AAEB" />
                </LinearGradient>
            </Defs>
            <Path
                d="M19.96 9.4599C19.29 8.7199 18.28 8.2899 16.88 8.1399V7.3799C16.88 6.0099 16.3 4.6899 15.28 3.7699C14.25 2.8299 12.91 2.3899 11.52 2.5199C9.12999 2.7499 7.11999 5.0599 7.11999 7.5599V8.1399C5.71999 8.2899 4.70999 8.7199 4.03999 9.4599C3.06999 10.5399 3.09999 11.9799 3.20999 12.9799L3.90999 18.5499C4.11999 20.4999 4.90999 22.4999 9.20999 22.4999H14.79C19.09 22.4999 19.88 20.4999 20.09 18.5599L20.79 12.9699C20.9 11.9799 20.92 10.5399 19.96 9.4599ZM11.66 3.9099C12.66 3.8199 13.61 4.1299 14.35 4.7999C15.08 5.4599 15.49 6.3999 15.49 7.3799V8.0799H8.50999V7.5599C8.50999 5.7799 9.97999 4.0699 11.66 3.9099ZM8.41999 13.6499H8.40999C7.85999 13.6499 7.40999 13.1999 7.40999 12.6499C7.40999 12.0999 7.85999 11.6499 8.40999 11.6499C8.96999 11.6499 9.41999 12.0999 9.41999 12.6499C9.41999 13.1999 8.96999 13.6499 8.41999 13.6499ZM15.42 13.6499H15.41C14.86 13.6499 14.41 13.1999 14.41 12.6499C14.41 12.0999 14.86 11.6499 15.41 11.6499C15.97 11.6499 16.42 12.0999 16.42 12.6499C16.42 13.1999 15.97 13.6499 15.42 13.6499Z"
                fill="url(#paint0_linear_35_4353)"
            />
        </Svg>
    );
};