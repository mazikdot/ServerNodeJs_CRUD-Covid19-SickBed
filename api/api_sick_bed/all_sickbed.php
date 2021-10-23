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
$read_function = new  SelectSickbed($db);
  
// query products
$stmt = $read_function ->all_sickbed();
$num = $stmt->rowCount();
  
// check if more than 0 record found
if($num>0){
  
    // products array
    $amphures_arr=array();
    $amphures_arr["data"]=array();

  
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
  
        $amphures_item=array(
            "data_sickbed" => $data_sickbed,
            "sick_note" => $sick_note,
            "sick_whogive" => $sick_whogive,
            "sit_name" => $sit_name,
            "users" => $users,
            "user_phone" => $user_phone,
            "date_add" => $date_add,
            
        );
  
        array_push($amphures_arr["data"], $amphures_item);
    }
  
    // set response code - 200 OK
    http_response_code(200);
  
    // make it json format
    echo json_encode($amphures_arr,JSON_UNESCAPED_UNICODE);
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