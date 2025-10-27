import { useEffect, useRef } from 'react';

const VideoBg1 = () => {

    const playerRef = useRef(null);

    useEffect(() => {
        // Function to load scripts dynamically
        const loadScript = (src, onLoad) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = onLoad;
            document.body.appendChild(script);
        };

        // Load jQuery first
        loadScript('https://code.jquery.com/jquery-3.6.0.min.js', () => {
            // Once jQuery is loaded, load the YTPlayer plugin
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.mb.YTPlayer/3.3.9/jquery.mb.YTPlayer.min.js', () => {
                // Initialize YTPlayer after both scripts are loaded
                if (window.jQuery && playerRef.current) {
                    const $player = window.jQuery(playerRef.current);

                    // Initialize the player and listen for the 'YTPReady' event
                    $player.mb_YTPlayer();

                    // Add event listener to ensure actions are performed after the player is ready
                    $player.on('YTPReady', function () {
                        console.log('Player is ready!');
                    });
                }
            });
        });

        // Clean up: Remove the dynamically added scripts when the component unmounts
        return () => {
            const jQueryScript = document.querySelector('script[src="https://code.jquery.com/jquery-3.6.0.min.js"]');
            const ytPlayerScript = document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mb.YTPlayer/3.3.9/jquery.mb.YTPlayer.min.js"]');
            if (jQueryScript) document.body.removeChild(jQueryScript);
            if (ytPlayerScript) document.body.removeChild(ytPlayerScript);
        };
    }, []);

    return (
        <>
            <div className="player shadow"
                ref={playerRef}
                data-property="{
                    videoURL:'HUozIpTODZQ',
                    containment:'.video-bg-live',
                    showControls:false,
                    autoPlay:true,
                    zoom:0,
                    loop:true,
                    mute:true,
                    startAt:10,
                    opacity:1,
                    quality:'default'
                    }"
            />
        </>
    );
};

export default VideoBg1;