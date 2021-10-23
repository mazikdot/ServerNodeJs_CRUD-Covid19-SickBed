<?php
require_once '../database/connection.php';

header("Access-Control-Allow-Origin: * ");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$i_user_username = '';
$i_user_passwords = '';
$i_user_firstname = '';
$i_user_lastname = '';
$i_user_email = '';
$i_user_phone = '';
$i_prefix_id = '';
$i_sex_id = '';
$i_province_id ='';
$i_roles_id = '';
$conn = null;

$databaseService = new Database();
$conn = $databaseService->getConnection();

$data = json_decode(file_get_contents("php://input"));

$i_user_username = $data->user_username;
$i_user_passwords = $data->user_passwords;
$i_user_firstname = $data->user_firstname;
$i_user_lastname = $data->user_lastname;
$i_user_email = $data->user_email;
$i_user_phone = $data->user_phone;
$i_prefix_id = $data->prefix_id;
$i_sex_id = $data->sex_id;
$i_province_id = $data->province_id;
$i_roles_id = $data->roles_id;

// $password = $data->password;

$table_name = 'tbusers';

$query = "
INSERT INTO tbusers(user_username,user_passwords,user_firstname,user_lastname,user_email,user_phone,prefix_id,
sex_id,province_id,roles_id) 
VALUES (:i_user_username,:i_user_passwords,:i_user_firstname,:i_user_lastname,:i_user_email,:i_user_phone,:i_prefix_id,:i_sex_id,:i_province_id,
:i_roles_id)";

$stmt = $conn->prepare($query);

$stmt->bindParam(':i_user_username', $i_user_username);
// $stmt->bindParam(':i_user_passwords', $i_user_passwords);
$stmt->bindParam(':i_user_firstname', $i_user_firstname);
$stmt->bindParam(':i_user_lastname', $i_user_lastname);
$stmt->bindParam(':i_user_email', $i_user_email);
$stmt->bindParam(':i_user_phone', $i_user_phone);
$stmt->bindParam(':i_prefix_id', $i_prefix_id);
$stmt->bindParam(':i_sex_id', $i_sex_id);
$stmt->bindParam(':i_province_id', $i_province_id);
$stmt->bindParam(':i_roles_id', $i_roles_id);

$password_hash = password_hash($i_user_passwords, PASSWORD_BCRYPT);

$stmt->bindParam(':i_user_passwords', $password_hash);


if($stmt->execute()){

    http_response_code(200);
    echo json_encode(array("message" => "User was successfully registered."));
}
else{
    http_response_code(400);

    echo json_encode(array("message" => "Unable to register the user."));
}
?>