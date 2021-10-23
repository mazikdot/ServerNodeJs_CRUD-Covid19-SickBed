<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include_once '../../database/connection.php';
include_once 'function.php';
  
// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
  
// initialize object
$read_function = new SelectProAmDis($db);
  
// query products
$stmt = $read_function ->readProvince();
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // products array
    $province_arr=array();
    $province_arr["data"]=array();

  
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
  
        $province_item=array(
            "province_id" => $province_id,
            "name_th" => $name_th
        );
  
        array_push($province_arr["data"], $province_item);
    }
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($province_arr,JSON_UNESCAPED_UNICODE);
}
  
else{
  
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the user products does not exist
    echo json_encode(
        array("message" => "No products found.")
    );
}
?>