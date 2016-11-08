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
	var fullname_check;
	var arr = fullname.split(" ", 4);
	var len = arr.length;
	var index = 0;
	var result_string;

	fullname_check = fullname.replace(/[0-9]/g, '');
	fullname_check = fullname_check.replace("_", '');
	fullname_check = fullname_check.replace("/", '');
	if ((len>3) || (arr[0].length==0) || (fullname != fullname_check))
	{
		result_string = "Invalid fullname";
	}
	else
	{
		result_string = arr[len-1];
		while (index<len-1)
		{
			result_string = result_string + ' ' + arr[index][0] + '.';
			index++;
		}
	}
	res.send(result_string);	
});


app.listen(3000, () => {
  console.log('Your app listening on port 3000!');
});
