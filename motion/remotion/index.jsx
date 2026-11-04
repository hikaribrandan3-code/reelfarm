import React from 'react';
import {registerRoot,Composition} from 'remotion';
import {BrandMotion} from './BrandMotion.jsx';
registerRoot(()=> <Composition id="ReelFarmBrand" component={BrandMotion} durationInFrames={240} fps={30} width={1000} height={420}/>);
