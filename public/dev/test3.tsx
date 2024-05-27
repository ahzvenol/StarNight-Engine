const Example =
    (<>
        <Configs>
            <Variable name="globalVolume" type="number" defaultValue="1" />
            <Computation name="bgmVolumeC" type="*">
                <Variable ref="globalVolume" />
                <Variable name="bgmVolume" type="number" defaultValue="1" />
            </Computation>
            <Audio name="bgm" src="bgm001.mp3" bind="bgmVolumeC" />
        </Configs>
        <Graphics width="1280" height="720" >
            <Router name="start">
                <Clone
                    coordinate={<args x="100" y="100" />}
                    count={<args x="3" y="5" />}
                    size={<args x="40" y="60" />}
                    arguments={<a start save-load config gallery />}>
                    <Element tags={<route to="a[i]" />} />
                </Clone>
            </Router>
            <Router name="save-load">

            </Router>
            <Router name="config">

            </Router>
            <Router name="gallery">

            </Router>
        </Graphics >
    </>)


{/* <Graphics width=1280 height=720>
<Router name="start">
    <Clone 
    coordinate="<args x=100 y=100/>" 
    count="<args x=3 y=5/>" 
    size="<args x=40 y=60/>"
    arguments="<a start saveLoad config gallery>">
        <Element tags="<route to=`a[i]`/>" />
    </Clone>
</Router>
<Router name="save-load">

</Router>
<Router name="config">

</Router>
<Router name="gallery">

</Router>

</Graphics> */}