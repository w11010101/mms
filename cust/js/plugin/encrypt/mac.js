//document.write(" <script language=\"javascript\" src="\/js\/ md5.js \" > <\/script>"); 

var softmac_ansi99 = function(pInitData, pInBuf, nInLen, pKey) {
  //var buf = pInBuf.slice(0);
  var nlen = 0;
  if (nInLen % 8 == 0) nlen = nInLen;
  else nlen = (Math.floor(nInLen / 8) + 1) * 8;

  var indata = new Array();
  var buf = pInBuf[0];
  for (var i = 0; i < 8; i++) {
    indata[i] = pInitData[i] ^ buf.charCodeAt(i);
  }

  var bytesToStr = function(aBytes) {
    var result = '';
    for (var i = 0; i < aBytes.length; i++) {
      result += String.fromCharCode(aBytes[i]);
    }
    return result;
  }

  var str = '',
  ciphertext = '';
  var outdata = new Array();
  for (var i = 0; i < Math.floor(nlen / 8) - 1; i++) {
    str = bytesToStr(indata);
    ciphertext = des(pKey, str, 1, 0);
    //alert("DES Test: " + stringToHex (ciphertext)); 
    for (var k = 0; k < ciphertext.length; k++) {
      outdata[k] = ciphertext.charCodeAt(k);
    }
    for (var j = 0; j < 8; j++)
    indata[j] = outdata[j] ^ buf.charCodeAt((i + 1) * 8 + j);
  }
  str = bytesToStr(indata);
  ciphertext = des(pKey, str, 1, 0);

  result = stringToHex(ciphertext);
  //alert("DES Test: " + result); 

  return result;
}