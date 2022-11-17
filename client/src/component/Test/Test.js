import React, {useEffect, useState} from 'react'

export const Test = ({post}) => {

    const [categoryColor, setCategoryColor] = useState(null);

    console.log(post.categories);
    useEffect(() => {
        if (post.categories === 'All') {
            setCategoryColor('red');
        }
        else if (post.categories === 'Coding') {
            setCategoryColor('green');
        }
    },[categoryColor])

    // const handleCategoryColor = (post) => {
    //     if (post.categories === 'All') {
    //       setCategoryColor('#ff0000');
    //     }
    //     else if (post.categories === 'Coding') {
    //       setCategoryColor('#0088ff');
    //     }
    //     else if (post.categories === 'Interview_Experiences') {
    //       setCategoryColor('#00ff48');
    //     }
    //     else if (post.categories === 'General_Discussion') {
    //       setCategoryColor('#ffd000');
    //     }
    //     else if (post.categories === 'GuidanceAndTips') {
    //       setCategoryColor('pink');
    //     }
    //   }

    return (
        <h1 style={{ color: categoryColor }}>Hello Shadab</h1>
    )
}
