<?php
    class login{

            public $user_username;
            public $user_passwords;
            public $user_firstname;
            public $user_lastname; 
            public $user_email; 
            public $user_phone; 
            public $prefix_id;
            public $sex_id;
            public $province_id;
            public $roles_id;
            private $conn;
            /*-----------Connect-----------*/
            public function __construct($db){
                $this->conn = $db;
            }

        public function insert_login(){
           
                $query = "
                INSERT INTO tbusers(user_username,user_passwords,user_firstname,user_lastname,user_email,user_phone,prefix_id,
                sex_id,province_id,roles_id,amphure_id,districts_id) 
                VALUES (:user_username,:user_passwords,:user_firstname,:user_lastname,:user_email,:user_phone,:prefix_id,:sex_id,:province_id,
                :roles_id,:amphure_id,:districts_id)";
                
                // prepare query
                $stmt = $this->conn->prepare($query);
            
                // sanitize
                $this->user_username=htmlspecialchars(strip_tags($this->user_username));
                $this->user_passwords=htmlspecialchars(strip_tags($this->user_passwords));
                $this->user_firstname=htmlspecialchars(strip_tags($this->user_firstname));
                $this->user_lastname=htmlspecialchars(strip_tags($this->user_lastname));
                $this->user_email=htmlspecialchars(strip_tags($this->user_email));
                $this->user_phone=htmlspecialchars(strip_tags($this->user_phone));
                $this->prefix_id=htmlspecialchars(strip_tags($this->prefix_id));
                $this->sex_id=htmlspecialchars(strip_tags($this->sex_id));
                $this->province_id=htmlspecialchars(strip_tags($this->province_id));
                $this->roles_id=htmlspecialchars(strip_tags($this->roles_id));
                $this->amphure_id=htmlspecialchars(strip_tags($this->amphure_id));
                $this->districts_id=htmlspecialchars(strip_tags($this->districts_id));
            
                // bind values
                $stmt->bindParam(":user_username", $this->user_username);
                $stmt->bindParam(":user_passwords", $this->user_passwords);
                $stmt->bindParam(":user_firstname", $this->user_firstname);
                $stmt->bindParam(":user_lastname", $this->user_lastname);
                $stmt->bindParam(":user_email", $this->user_email);
                $stmt->bindParam(":user_phone", $this->user_phone);
                $stmt->bindParam(":prefix_id", $this->prefix_id);
                $stmt->bindParam(":sex_id", $this->sex_id);
                $stmt->bindParam(":province_id", $this->province_id);
                $stmt->bindParam(":roles_id", $this->roles_id);
                $stmt->bindParam(":districts_id", $this->districts_id);
                $stmt->bindParam(":amphure_id", $this->amphure_id);
               
            
                // execute query
                if($stmt->execute()){
                    return true;
                }
            
                return false;
              
            }
    }
?>