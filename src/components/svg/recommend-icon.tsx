import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

const RecommendIcon = ( { width = 19, height = 18, className = "", style = null, fill = null, ...props } ) =>
{
    return (
        <Svg
            width={ width }
            height={ height }
            viewBox="0 0 19 18"
            fill="none"
            className={ className }
            style={ style }
            { ...props }
        >
            <Defs>
                <LinearGradient
                    id="paint0_linear_32_1047"
                    x1="18.2017"
                    y1="19.0679"
                    x2="2.36442"
                    y2="18.4481"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#12B2B3" />
                    <Stop offset="1" stopColor="#56E0E0" />
                </LinearGradient>
                <LinearGradient
                    id="paint1_linear_32_1047"
                    x1="13.7948"
                    y1="17.0011"
                    x2="6.22194"
                    y2="15.6427"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#12B2B3" />
                    <Stop offset="1" stopColor="#56E0E0" />
                </LinearGradient>
            </Defs>
            <Path
                d="M14.9077 4.77001C14.1277 3.19501 12.6202 2.03251 10.8727 1.65001C9.04266 1.24501 7.16766 1.68001 5.73516 2.83501C4.29516 3.98251 3.47766 5.70001 3.47766 7.53751C3.47766 9.48001 4.64016 11.5125 6.39516 12.69V13.3125C6.38766 13.5225 6.38016 13.845 6.63516 14.1075C6.89766 14.3775 7.28766 14.4075 7.59516 14.4075H11.4427C11.8477 14.4075 12.1552 14.295 12.3652 14.085C12.6502 13.7925 12.6427 13.4175 12.6352 13.215V12.69C14.9602 11.1225 16.4227 7.81501 14.9077 4.77001Z"
                fill={ fill || "url(#paint0_linear_32_1047)" }
            />
            <Path
                d="M11.9451 16.5C11.9001 16.5 11.8476 16.4925 11.8026 16.4775C10.2951 16.05 8.71262 16.05 7.20512 16.4775C6.92762 16.5525 6.63512 16.395 6.56012 16.1175C6.47762 15.84 6.64262 15.5475 6.92012 15.4725C8.61512 14.9925 10.4001 14.9925 12.0951 15.4725C12.3726 15.555 12.5376 15.84 12.4551 16.1175C12.3801 16.35 12.1701 16.5 11.9451 16.5Z"
                fill={ fill || "url(#paint1_linear_32_1047)" }
            />
        </Svg>
    )
}

export default RecommendIcon