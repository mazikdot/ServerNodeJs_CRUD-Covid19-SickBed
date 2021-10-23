<?php
    class SelectProAmDis{

        public $province_id;
        public $name_th;
        private $conn;
        /*-----------Connect-----------*/
        public function __construct($db){
            $this->conn = $db;
        }
        public function readProvince(){
    
            // select query
            $query = "SELECT province_id,name_th FROM provinces ORDER BY name_th ASC;";
        
            // prepare query statement
            $stmt = $this->conn->prepare( $query );
        
            // bind variable values
            // $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
            // $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);
        
            // execute query
            $stmt->execute();
        
            // return values from database
            return $stmt;
        }
        public function readAmphures($province_id){
            $query = "SELECT amphure_id,name_th FROM amphures WHERE province_id = {$province_id} ORDER BY name_th ASC;";
        
            // prepare query statement
            $stmt = $this->conn->prepare( $query );
            // execute query
            $stmt->execute();
        
            // return values from database
            return $stmt;
        }
        public function readDistricts($amphures_id){
            $query = "SELECT districts_id,name_th FROM districts WHERE amphure_id = {$amphures_id} ORDER BY name_th ASC;";
        
            // prepare query statement
            $stmt = $this->conn->prepare( $query );
            // execute query
            $stmt->execute();
        
            // return values from database
            return $stmt;
        }
        public function readPrefix(){
            $query = "SELECT prefix_id,pre_th_name FROM tbprefix;";
        
            // prepare query statement
            $stmt = $this->conn->prepare( $query );
            // execute query
            $stmt->execute();
        
            // return values from database
            return $stmt;
        }
        public function readSex(){
            $query = "SELECT sex_id,sex_name FROM tbsex;";
        
            // prepare query statement
            $stmt = $this->conn->prepare( $query );
            // execute query
            $stmt->execute();
        
            // return values from database
            return $stmt;
        }
        function insert_user(){
    
            // query to insert record
            $query = "INSERT INTO
                        " . $this->table_name . "
                    SET
                        name=:name, price=:price, description=:description, category_id=:category_id, created=:created";
            
            // prepare query
            $stmt = $this->conn->prepare($query);
        
            // sanitize
            $this->name=htmlspecialchars(strip_tags($this->name));
            $this->price=htmlspecialchars(strip_tags($this->price));
            $this->description=htmlspecialchars(strip_tags($this->description));
            $this->category_id=htmlspecialchars(strip_tags($this->category_id));
            $this->created=htmlspecialchars(strip_tags($this->created));
        
            // bind values
            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":price", $this->price);
            $stmt->bindParam(":description", $this->description);
            $stmt->bindParam(":category_id", $this->category_id);
            $stmt->bindParam(":created", $this->created);
        
            // execute query
            if($stmt->execute()){
                return true;
            }
        
            return false;
          
    }

    }
?>