import React, { Component }         from 'react';
import ImageGallery from '../../../../../node_modules/react-image-gallery/build/image-gallery.js';
import  '../../../../../node_modules/react-image-gallery/build/image-gallery.css';
import './index.less'
export default class MyImageGallery extends Component {

    render() {
        let images = [
            {
                original: '/images/banner/banner-01.jpg',
                thumbnail: '/images/banner/banner-01.jpg',
            },
            {
                original: '/images/banner/banner-02.jpg',
                thumbnail: '/images/banner/banner-02.jpg',
            },
            {
                original: '/images/banner/banner-03.jpg',
                thumbnail: '/images/banner/banner-03.jpg',
            },
            {
                original: '/images/banner/banner-04.jpg',
                thumbnail: '/images/banner/banner-04.jpg',
            },
            {
                original: '/images/banner/banner-05.jpg',
                thumbnail: '/images/banner/banner-05.jpg',
            }
        ];
        return (
            <div className='imageGallery'>
                <ImageGallery ref='ImageGallery'
                              infinite={true}
                              showNav={true}
                              showThumbnails={true}
                              showBullets={true}
                              autoPlay={true}
                              items={images}
                              slideInterval={3000}
                    />
            </div>
        );
    }


};
