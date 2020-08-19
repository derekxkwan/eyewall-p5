let w = 400, h = 300, hw = w/2.0, hh = h/2.0;
let copy_w = 36, copy_h = 21;
let copy_texel_w, copy_texel_h;
let cnv, cam, ctracker, pos = [];
let eye_copy, facelayer, eyelayer, bglayer;
let inco, shad;
let texel_w, texel_h;
let color_inc = [0.07, 0.09, 0.08];
let color_min = 0.5;
let bgcolor = [0.5, 0.5, 0.5];
let eye_y0 = 0; // 0 - 1
let eye_y0inc = 0.05;


function calc_eye_y0()
{
    let cur_y0 = eye_y0;
    cur_y0 -= eye_y0inc;
    while(cur_y0 < 0) cur_y0 += 1.0;

    eye_y0 = cur_y0;
}
function get_dec(cur_num)
{
    return (cur_num - Math.floor(cur_num));
}


function calc_bgcolor()
{
    let cur_color = bgcolor;

    for(var i=0; i < bgcolor.length; i++)
    {
	let cur_comp = bgcolor[i];
	cur_comp += color_inc[i];
	while(cur_comp > 1) cur_comp -= color_min;
	bgcolor[i] = cur_comp;
    };
}
function get_avg(curtop, curbottom)
{
    let avg_x = (curtop[0] + curbottom[0])/2.0;
    let avg_y = (curtop[1]*0.5 + curbottom[1]*0.5);
    //let avg_y = curtop[1];
    return [avg_x, avg_y];
}

function map_to_3d(xy)
{
    let min_in = [0,0];
    let min_out = [-width/2, -height/2];
    let max_in = [width, height];
    let max_out = [width/2, height/2];
    let in_range = [max_in[0] - min_in[0], max_in[1] - min_in[1]];
    let out_range = [max_out[0] - min_out[0], max_out[1] - min_out[1]];
    let x_out = ((xy[0] - min_in[0])/in_range[0])*out_range[0] + min_out[0];
    let y_out = ((xy[1] - min_in[1])/in_range[1])*out_range[1] + min_out[1];

    return [x_out, y_out];    
}

function preload()
{
    inco = loadFont('res/Inconsolata.otf');
    shad = loadShader('basic.vert', 'basic.frag');

}



function setup()
{
    createCanvas(w,h);
    console.log("start");
    cam = load_cam();
    cam.hide();
    ctracker = load_tracker(cam);
    cnv = load_canvas(w,h);
    facelayer = createGraphics(w,h);
    bglayer = createGraphics(w,h);
    bglayer.colorMode(RGB, 1.0);
    
    eyelayer = createGraphics(w,h,WEBGL);
    textFont(inco);
    textSize(height / 30);
    fill(255);
    texel_h = 1.0/height;
    texel_w = 1.0/width;
    copy_texel_w = copy_w * texel_w;
    copy_texel_h = copy_h * texel_h;


}



function draw_eye(eye_arr)
{
   facelayer.beginContour();
   for(var i =1; i < eye_arr.length; i++)
    {
	let cur_idx = eye_arr[i];
	let cur_x = pos[cur_idx][0];
	let cur_y = pos[cur_idx][1];

	//circle(cur_x, cur_y, 5);
	facelayer.vertex(cur_x, cur_y);
    };

    facelayer.endContour();
}

function draw_face()
{
    
    facelayer.beginContour();
    //facelayer.fill(0);
    for(var i=0; i < facearr.length; i++)
    {
	let cur_idx = facearr[i];
	let cur_x = pos[cur_idx][0];
	let cur_y = pos[cur_idx][1];


	//facelayer.circle(cur_x, cur_y, 5);

	facelayer.vertex(cur_x, cur_y);


    }
    	facelayer.endContour();
}

function draw_mouth()
{
  facelayer.beginContour();
   for(var i =1; i < innermouth.length; i++)
    {
	let cur_idx = innermouth[i];
	let cur_x = pos[cur_idx][0];
	let cur_y = pos[cur_idx][1];

	//circle(cur_x, cur_y, 5);
	facelayer.vertex(cur_x, cur_y);
    };

    facelayer.endContour();
}


function drawfacebg()
{
    calc_bgcolor();
     bglayer.clear();

    
    bglayer.noStroke();
    bglayer.fill(bgcolor[0], bgcolor[1], bgcolor[2]);
    
    bglayer.beginShape();


  for(var i=0; i < facearr.length; i++)
    {
	let cur_idx = facearr[i];
	let cur_x = pos[cur_idx][0];
	let cur_y = pos[cur_idx][1];


	//facelayer.circle(cur_x, cur_y, 5);

	bglayer.vertex(cur_x, cur_y);


    }
   
    

    

   bglayer.endShape(CLOSE);
    image(bglayer,0,0,w,h);



}

function drawparts()
{

    //toplayer.fill(255,50);
    //toplayer.noStroke();
    //toplayer.rect(0,0,w,h);

   // facelayer.fill(255);
    //facelayer.rect(0,0,w,h);
    facelayer.clear();
    facelayer.image(cam,0,0,w,h);
    
    facelayer.erase();
    
    facelayer.beginShape();

    /*
    facelayer.vertex(0,0);
    facelayer.vertex(w,0);
    facelayer.vertex(w,h);
    facelayer.vertex(0,h);
    */

    facelayer.vertex(0,0);
    facelayer.vertex(0,h);
    facelayer.vertex(w,h);
    facelayer.vertex(w,0);
    
    draw_face();
    
    draw_eye(lefteye);
    draw_eye(righteye);
   // draw_mouth();
   facelayer.endShape(CLOSE);
    facelayer.noErase();


    /*
    texture(facelayer);
    plane(w, h);
    */
    image(facelayer,0,0,w,h);
}

function draw_pos()
{
    fill(0);
    for(var i =0; i < pos.length; i++)
    {
	let cur_x = pos[i][0];
	let cur_y = pos[i][1];

	circle(cur_x, cur_y, 5);
	text(i, cur_x, cur_y);
    }
}

function draw()
{
    //clear();
    pos = get_pos(ctracker);
    let cur_ms = millis();
    if(pos.length > 0)
    {
	let cur_eye = lefteye;

	/*
	let copytop = pos[cur_eye[3]];
	let copybottom = pos[cur_eye[7]];
	let copycenter = get_avg(copytop, copybottom);
	*/
	/*
	let copyleft = pos[cur_eye[1]];
	let copyright = pos[cur_eye[5]];
	let copycenter = get_avg(copyleft, copyright);
	*/
	let copycenter = pos[cur_eye[0]];
	
	//copycenter = map_to_3d(copycenter);
	let texel_copy_x = ((copycenter[0] - (copy_w/2.0)) * texel_w);
	let texel_copy_y = 1.0 - ((copycenter[1] + (copy_h)) * texel_h);


	

	//clear();

	calc_eye_y0();
	eyelayer.shader(shad);
	shad.setUniform('cam', cam);
	shad.setUniform('texel_w', texel_w);
	shad.setUniform('texel_h', texel_h);
	shad.setUniform('copy_x', texel_copy_x);
	shad.setUniform('copy_y', texel_copy_y);
	shad.setUniform('copy_w', copy_texel_w);
	shad.setUniform('copy_h', copy_texel_h);
	shad.setUniform('y_off', eye_y0);
	eyelayer.rect(0,0,w,h);
	image(eyelayer,0,0,w,h);
	//rect(-hw,-hh,w,h);
	
	/*
	fill(255,0,0);
	rect(-hw, -hh, w, h);
	*/
	drawfacebg();
	drawparts();

	//eyelayer.rect(0,0,w,h);
	//image(eyelayer, 0,0, w,h);
	//draw_pos();
	//image(toplayer,0,0,w,h);

	//draw_pos();
	//eyehit(pos, lefteye);
	/*
	if(leftthresh == true)
	{
	    blankeye(pos,lefteye);
	    //console.log("BLANKING");

	}
	*/
	//console.log(leftthresh);
	//rightthresh = eyeopen(pos, righteye);
	//console.log(rightthresh);
//	mouthhit(pos, innermouth);

    };
}

window.onerror = function(error) {
    alert(error);
};

