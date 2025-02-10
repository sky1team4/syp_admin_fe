import React from 'react'
import theme from "../../app/theme";

function button(info) {
    return (
        <>
            <button
                onClick={info.click ? ()=> info.click() : undefined}
                type="submit"
                className={`w-[10rem] md:w-${info.w} h-${info.h? info.h : ""} bg-[${theme.color}] text-white py-3 px-6 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm font-medium`}
            >
                {info.text}

            </button>
        </>
    )
}

export default button