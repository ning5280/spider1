/**
 * Created by ning on 17/6/5.
 */
/**
 * Created by ning on 17/6/5.
 */
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var pageNum = process.argv[2]?process.argv[2]:1;

var i = pageNum;

var iconv = require('iconv-lite');

var maxnum = 610; //抓取总条数
//初始url
function fetchPage(p) {     //封装了一层函数
    startRequest(p);
}



function startRequest(p) {


var options = {

    url:'http://aladd.net/page/'+p,
    headers: {
        'User-Agent': 'request'
    }
}
  request(options,function(error,res,body){
      if(error){
          console.log(error);
      }
      if (!error && res.statusCode == 200) {
          var $ = cheerio.load(body);
          $('.entry_box .box_entry h2 a').each(function(){
              var _this = $(this);
             fs.appendFile('./data/url.txt',_this.attr('href')+'\n',function(err){
                 if(err){
                     console.log('地址写入出错',err);
                     return false;
                 }
                 console.log(p+'页,成功写入'+_this.attr('href'));


             })
          })

          i++;
          if(i<=maxnum){
              setTimeout(function(){
                  fetchPage(i);
              },600)

          }

      }
  })


}

fetchPage(i);