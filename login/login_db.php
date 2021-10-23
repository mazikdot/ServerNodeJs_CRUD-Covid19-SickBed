<?php
    require_once '../database/connection.php';
    session_start();
    $database = new Database();
    $db = $database->getConnection();
    if(isset($_POST['btn_login'])){
        $user_username = $_POST['user_username'];
        $user_passwords = $_POST['user_passwords'];
        if(empty($user_username)){
            $errorMsg[] = "Please enter email";
        }
        else if (empty($user_passwords)){
            $errorMsg[] = "Please enter password";
        }
        else if($user_username AND $user_passwords){
          try {
                $select_stmt = $db->prepare("SELECT user_username ,user_passwords,roles_id FROM tbusers WHERE user_username
                =:user_username");
                $select_stmt->execute(array(':user_username' => $user_username));
                while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)){
                    $dbuser_username = $row['user_username'];
                    $dbuser_passwords = $row['user_passwords'];
                    $dbroles_id = $row['roles_id'];
                }         
                        if($select_stmt->rowCount() > 0){
                            if($user_username == $dbuser_username  AND password_verify($user_passwords,$dbuser_passwords) AND $dbroles_id == 1 
                        
                            ){
                                $_SESSION['user_login'] = $user_username;
                                header("Location: ../../client/user-page/user-home.php");
                                // header("Location: /Home");
                            }
                            else if ($user_username == $dbuser_username  AND password_verify($user_passwords,$dbuser_passwords)  AND $dbroles_id == 2){
                                $_SESSION['admin_login'] = $user_username;
                                header("Location: ../../client/page/admin.php");
                            }
                            else{
                                $_SESSION['error'] = "บัญชีหรือรหัสผ่านของท่านไม่ถูกต้อง";
                                header("location: ../../client/login/login.php");
                            }
                        }
                        else{
                            $_SESSION['error'] = "บัญชีหรือรหัสผ่านของท่านไม่ถูกต้อง";
                            header("location: ../../client/login/login.php");
                        }
            }catch(PDOException $e){
                $e->getMessage();
            }
           
        }
    }
?>