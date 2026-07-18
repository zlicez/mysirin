import React from "react";

// Style
import s from "./Video.module.scss";

const Video = ({ url }) => {
	return (
		<div className={s.video}>
			<iframe
				className={s.video__iframe}
				loading='lazy'
				width="1864"
				height="808"
				src={url}
				title="Танцевальный спектакль | Царевна-лягушка"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowFullScreen
			></iframe>
		</div>
	);
};

export default Video;
