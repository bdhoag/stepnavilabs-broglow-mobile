import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

export const HistoryOutlineIcon = ( { width = 24, height = 25, className = "", style = null, color = "#171B2E", ...props } ) =>
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
                d="M4.82203 9.21573C5.23294 8.45454 5.7651 7.69335 6.47913 6.97932C9.70576 3.75269 14.933 3.75269 18.1597 6.97931C21.3863 10.2059 21.3863 15.4332 18.1597 18.6598C14.933 21.8865 9.70576 21.8865 6.47914 18.6598"
                stroke={ color }
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M4.14841 10.2125L3.85876 6.02932"
                stroke={ color }
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M4.14847 10.2124L8.07566 9.59941"
                stroke={ color }
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M16.2663 16.3805L13.3131 14.6181C12.7987 14.3132 12.3795 13.5797 12.3795 12.9795V9.07373"
                stroke={ color }
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export const HistoryIcon = ( { width = 24, height = 25, className = "", style = null, color = "#171B2E", ...props } ) =>
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
                    id="paint0_linear_77_370"
                    x1="24.0283"
                    y1="12.8477"
                    x2="0.667245"
                    y2="12.8477"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#1584F2" />
                    <Stop offset="1" stopColor="#02AAEB" />
                </LinearGradient>

                {/* Gradient for the first arrow indicator */ }
                <LinearGradient
                    id="paint1_linear_77_370"
                    x1="6.1006"
                    y1="8.27165"
                    x2="1.95736"
                    y2="8.55854"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#1584F2" />
                    <Stop offset="1" stopColor="#02AAEB" />
                </LinearGradient>

                {/* Gradient for the second arrow indicator */ }
                <LinearGradient
                    id="paint2_linear_77_370"
                    x1="8.07968"
                    y1="9.60392"
                    x2="4.3393"
                    y2="9.02009"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#1584F2" />
                    <Stop offset="1" stopColor="#02AAEB" />
                </LinearGradient>

                {/* Gradient for the clock hand inside the circle */ }
                <LinearGradient
                    id="paint3_linear_77_370"
                    x1="16.2663"
                    y1="16.3987"
                    x2="10.2072"
                    y2="13.1756"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#1584F2" />
                    <Stop offset="1" stopColor="#02AAEB" />
                </LinearGradient>
            </Defs>
            <Path
                d="M4.82203 9.21548C5.23294 8.45429 5.7651 7.69311 6.47913 6.97907C9.70576 3.75244 14.933 3.75244 18.1597 6.97907C21.3863 10.2057 21.3863 15.433 18.1597 18.6596C14.933 21.8862 9.70576 21.8862 6.47914 18.6596"
                stroke="url(#paint0_linear_77_370)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M4.14841 10.213L3.85876 6.02981"
                stroke="url(#paint1_linear_77_370)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M4.14847 10.2129L8.07566 9.5999"
                stroke="url(#paint2_linear_77_370)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M16.2663 16.381L13.3131 14.6186C12.7987 14.3137 12.3795 13.5802 12.3795 12.98V9.07422"
                stroke="url(#paint3_linear_77_370)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

