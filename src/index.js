import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/', (req, res) => {
  res.json({
    hello: 'JS World',
  });
});


app.get('/task2A', (req, res) => {
	const sum = (+req.query.a || 0) + (+req.query.b || 0);
	res.send(sum.toString());	
});

function remove_double_spaces(str)
{
	str = str.replace(/ {1,}/g," ");
	return str;
}

app.get('/task2B', (req, res) => {
	var fullname = remove_double_spaces(req.query.fullname.toString());
	fullname = fullname.replace(/^\s+/g, '');
	fullname = fullname.toLowerCase();
	var fullname_check;
	var arr = fullname.split(" ", 4);
	var len = arr.length;
	var index = 0;
	var result_string;

	fullname_check = fullname.replace(/[0-9]/g, '');
	fullname_check = fullname_check.replace("_", '');
	fullname_check = fullname_check.replace("/", '');
	console.log(fullname);
	if ((len>3) || (arr[0].length==0) || (fullname != fullname_check))
	{
		result_string = "Invalid fullname";
	}
	else
	{
		result_string = arr[len-1];
		result_string = result_string.charAt(0).toUpperCase() + result_string.slice(1);
		while (index<len-1)
		{
			result_string = result_string + ' ' + arr[index].charAt(0).toUpperCase() + '.';
			index++;
		}
	}
	res.send(result_string);	
});

function find_nth_incoming(str, substr, n)
{
	var i = 0;
	var count = 0;
	var index = -1;
	do {
	    index = str.indexOf(substr,i);
	    i = index + 1;
	    count++;
	} while ((index!=-1) && (count!=n))
	return index;
}

app.get('/task2C', (req, res) => {
	var username_string = req.query.username.toString().replace(/@/g,'');

	var third_slash_index = find_nth_incoming(username_string, "/", 3);//username_string.lastIndexOf("/");
	var last_slash_index = username_string.lastIndexOf("/");
	var use_slash_index = (third_slash_index > 0) ? third_slash_index : last_slash_index;
	
	var fourth_slash_index = find_nth_incoming(username_string, "/", 4);
	var question_symbol_index = username_string.lastIndexOf("?");
	var username_finish_index = (fourth_slash_index>question_symbol_index) ? fourth_slash_index : question_symbol_index;

	var result_string = '@';

	if ((use_slash_index>0) && (username_finish_index>use_slash_index))
	{
		result_string += username_string.substring(use_slash_index+1, username_finish_index);
	}
	else if (use_slash_index>0)
	{
		result_string += username_string.substring(use_slash_index+1);		
	}
	else
	{
		result_string += username_string;
	}

	res.send(result_string);
});

function isHex(h) {
	var re = /[0-9A-Fa-f]{6}/g;
	var re_excl = /[^0-9A-Fa-f]/g
	return (re.test(h) & !re_excl.test(h) & (h.length==6));
}

function fillString (input_string){
	var result = "";
	if (input_string.length==3){
		for (var i = 0; i<input_string.length; i++)
		{
			result += input_string[i] + input_string[i]; 
		}
	}
	else
	{
		result = input_string;
		for (var i = input_string.length; i < 6; i++) {
			result += input_string[i-1];
		}
	}	
	return result;
}

function queryIsValid(req){
	if ('color' in req.query) return true;
	else					  return false;

}

function hslToRgb(h, s, l){
    var r, g, b;

//    console.log(h);
//    console.log(s);
//    console.log(l);

    h /= 360;
    s /= 100;
    l /= 100;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function canonize(color_string){
	var result;
	result = color_string.toLowerCase();
	console.log(result);
	result = result.replace(/\s/g,'');
	result = result.replace(/%20/g,'');
	console.log(result);

	var rgb_func = result.match(/^rgb\((\d+),(\d+),(\d+)\)/);
	var hsl_func = result.match(/^hsl\((\d+),(\d+)%,(\d+)%\)/);
	//console.log(result);
	console.log(hsl_func);
	if (rgb_func)
	{
		var buf;
		result = "";
		for (var i = 1; i<=3; i++)
		{
			buf = Number(rgb_func[i]).toString(16);
			if (buf.length==1) buf = '0' + buf;
			result += buf;
			console.log(buf);
		}
	}
	else if (hsl_func)
	{
		if ((hsl_func[2]>=0) & (hsl_func[2]<=100) & (hsl_func[3]>=0) & (hsl_func[3]<=100))
		{
			var buf;
			result = "";
			var rgb = hslToRgb(hsl_func[1], hsl_func[2], hsl_func[3]);
			console.log(rgb);
			for (var i = 0; i<=2; i++)
			{
				buf = Number(rgb[i]).toString(16);
				if (buf.length==1) buf = '0' + buf;
				result += buf;
			}
		}
	}
	result = result.replace(/\#\#/g,'_');
	result = result.replace(/\#/g,'');
	console.log(result);
	result = fillString(result);
	return result;
}

app.get('/task2D', (req, res) => {
	if (queryIsValid(req))
	{
		var color_string = canonize(req.query.color.toString());
		console.log(color_string);
		var valid_color = isHex(color_string);
		var result;
		if (valid_color)
		{
			console.log(color_string);
			result = '#' + color_string;
		}
		else
		{
			result = "Invalid color";
			console.log(result);
		}
	}
	else
	{
		result = "Invalid color";
	}
	res.send(result);
});


app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
