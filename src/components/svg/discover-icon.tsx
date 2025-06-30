import React from 'react';
import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

const DiscoverIcon = ( { width = 18, height = 18, className = "", style = null, fill = null, ...props } ) =>
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
                    id="paint0_linear_32_1065"
                    x1="16.5"
                    y1="16.5364"
                    x2="1.5"
                    y2="1.53644"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#FFB800" />
                    <Stop offset="1" stopColor="#FFDA7B" />
                </LinearGradient>
            </Defs>
            <Path
                d="M9 1.5C4.8675 1.5 1.5 4.8675 1.5 9C1.5 13.1325 4.8675 16.5 9 16.5C13.1325 16.5 16.5 13.1325 16.5 9C16.5 4.8675 13.1325 1.5 9 1.5ZM7.875 12.0975C5.91 12.0975 5.91 12.0975 5.91 10.1325C5.91 7.8075 7.8 5.9175 10.125 5.9175C12.09 5.9175 12.09 5.9175 12.09 7.8825C12.09 10.2 10.2 12.0975 7.875 12.0975Z"
                fill={ fill || "url(#paint0_linear_32_1065)" }
            />
        </Svg>
    )
}

export default DiscoverIcon