const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQCIWDO7P6IJtVpXKZxNkHuYQSK7dbIEod_gPJdr8adwgor5LRdpE95GqP8nplUrUb1ap_CztSqpw7ohEMGvX8ZpPOc0eBXU5R3dWp3SffUZ4lUO1-BQb_XXRq5TC7mmK1o9PH617aeitxPE5QTes5Kfte4QhGMKBwv2YsSE0hO_q8aS998TdhqYNhkNcu22WngjhUfLK8OrXhciPwr4U4TdtMDaV2lAOsYyxB1H9MdZ5WkIKaE8SAN4BrRYmU0k_Wv56fMX96LlsGlB4cdsufhEbKu3bpPgtTtX_F7udawX5b4cyvpu7aDOKB9DMxGs_tOFlaLsw-7pf19C";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);
    getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
   // console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
   // console.log(tracks);

     const tracksJSON = { tracks }
     let data = JSON.stringify(tracksJSON);
     fs.writeFileSync(playlist.name+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

   //console.log('The playlist contains these tracks', data.body.items);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
   // console.log("track_obj.track.album", track_obj.track.album.images[0].url)
   // console.log("^^^^^^^^^^^^^^^^^^^^" + track_obj.track.album.images[0].url + track_obj.track.name + " : " + track_obj.track.artists[0].name)
  }
  
  //console.log("---------------+++++++++++++++++++++++++ )))))))", tracks)
  return tracks;
}

getMyData();
