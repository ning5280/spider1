/**
 * Created by ning on 17/6/6.
 */
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv-lite');
var pageNum = process.argv[2]?process.argv[2]:1;

fs.readFile('./data/url.txt',function(err,body){
    if(err){
        console.log(err);
        return false;
    }
    var data = body.toString();
    var urlList = data.split('\n');
    var i = 0;
    var urlLength=urlList.length;
    setInterval(function(){

        startRequest(urlList[i]);
        i++;
    },2000)

})

function startRequest(x) {
    var options = {

        url:x,
        gzip:true,
        headers: {
            Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
 'Accept-Encoding':'gzip, deflate, sdch',
 'Accept-Language':'zh-CN,zh;q=0.8',
 'Connection':'keep-alive',
 'Cookie':'Hm_lvt_295fb6522198c063fd8b98be9bd5e31f=1496650911,1496726578; Hm_lpvt_295fb6522198c063fd8b98be9bd5e31f=1496728117',
 'Host':'aladd.net',
 'Referer':'http://aladd.net/page/4',
 'Upgrade-Insecure-Requests':'1',
 'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36 QQBrowser/4.2.4718.400'

        }
    }
    console.log(x+'抓取中...');
    //采用http模块向服务器发起一次get请求
   request(options, function (err,res,body) {

            var $ = cheerio.load(body); //采用cheerio模块解析html
            // 获取标题
            var title = $('.entry_title h1').text().trim();

            savedImg($,title);    //存储每篇文章的图片及图片标题


    }).on('error', function (err) {
        console.log(err);
    });

}

//该函数的作用：在本地存储所爬取到的图片资源
function savedImg($,news_title) {

    $('.entry p img').each(function (index, item) {
        var img_title = news_title+index;  //获取图片的标题
        if(img_title.length>55||img_title==""){
            img_title="Null";}
        var img_filename = img_title + '.jpg';

        var img_src = $(this).attr('src'); //获取图片的url
        // console.log(img_src);
//采用request模块，向服务器发起一次请求，获取图片资源
        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        request(img_src).pipe(fs.createWriteStream('./image/sucai/'+ img_filename));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
    })
}