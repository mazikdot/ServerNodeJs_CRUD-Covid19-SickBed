<?php
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Max-Age: 3600");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

        require_once '../database/connection.php';
        require_once 'api_login/function.php';

        $database = new Database();
        $db = $database->getConnection();

        $insert_login = new login($db);

        $data = json_decode(file_get_contents("php://input"));
         
// make sure data is not empty
        if(
        !empty($data->user_username) &&
        !empty($data->user_passwords) &&
        !empty($data->user_firstname) &&
        !empty($data->user_lastname) &&
        !empty($data->user_email) &&
        !empty($data->user_phone) &&
        !empty($data->prefix_id) &&
        !empty($data->sex_id) &&
        !empty($data->province_id) &&
        !empty($data->roles_id) 
     
    ){
        
        // set product property values
        $hash_password = password_hash($data->user_passwords,PASSWORD_DEFAULT);
        $insert_login->user_username = $data->user_username;
        $insert_login->user_passwords = $hash_password;
        $insert_login->user_firstname = $data->user_firstname;
        $insert_login->user_lastname = $data->user_lastname;
        $insert_login->user_email = $data->user_email;
        $insert_login->user_phone = $data->user_phone;
        $insert_login->prefix_id = $data->prefix_id;
        $insert_login->sex_id = $data->sex_id;
        $insert_login->province_id = $data->province_id;
        $insert_login->roles_id = $data->roles_id;
        if(strlen($data->user_passwords) >= 6){
        if($insert_login->insert_login()){
      
            http_response_code(201);
            echo json_encode(array("message" => "สมัครบัญชีผู้ใช้สำเร็จ"));
        }
        else{
            http_response_code(503);
            echo json_encode(array("message" => "บัญชีผู้ใช้นี้เปิดใช้งานแล้ว - โปรดลองป้อนบัญชีใหม่อีกครั้ง "));
        }
        }
        else{
            http_response_code(503);
            echo json_encode(array("message" => "กรอกรหัสผ่านไม่น้อยกว่า 6 ตัวอักษร"));
        }
    }

    else{
      
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create product. Data is incomplete."));
    }

?>