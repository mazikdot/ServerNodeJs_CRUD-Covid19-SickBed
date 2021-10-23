<?php
    class SelectSickbed{

        
        private $conn;
        /*-----------Connect-----------*/
        public function __construct($db){
            $this->conn = $db;
        }
        public function readSickbed(){
    
            // select query
            $query = "SELECT CONCAT(a.sick_name,' จำนวน ',a.sick_amount,' ตัว') as data_sickbed,a.sick_note,'  ',a.sick_whogive,b.sit_name,CONCAT(d.pre_th_name,c.user_firstname,' ',c.user_lastname) as users, CONCAT('ติดต่อ : ',' ',c.user_phone) as user_phone
            FROM tbsick_bed as a 
                        INNER JOIN tbsick_status as b ON a.sit_id = b.sit_id
                        INNER JOIN tbusers as c ON c.user_username = a.user_username
                        INNER JOIN tbprefix as d ON d.prefix_id = c.prefix_id WHERE a.sit_id = 2";
        
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
        public function readSickNo(){
    
            // select query
            $query = "SELECT CONCAT(a.sick_name,' จำนวน ',a.sick_amount,' ตัว') as data_sickbed,a.sick_note,'  ',a.sick_whogive,b.sit_name,CONCAT(d.pre_th_name,c.user_firstname,' ',c.user_lastname) as users, CONCAT('ติดต่อ : ',' ',c.user_phone) as user_phone
            FROM tbsick_bed as a 
                        INNER JOIN tbsick_status as b ON a.sit_id = b.sit_id
                        INNER JOIN tbusers as c ON c.user_username = a.user_username
                        INNER JOIN tbprefix as d ON d.prefix_id = c.prefix_id WHERE a.sit_id = 1";
        
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
        public function all_sickbed(){
    
            // select query
            $query = "SELECT CONCAT(a.sick_name,' จำนวน ',a.sick_amount,' ตัว') as data_sickbed,a.sick_note,'  ',CONCAT('-- ',a.date_add,' --') as date_add,a.sick_whogive,b.sit_name,CONCAT(d.pre_th_name,c.user_firstname,' ',c.user_lastname) as users, CONCAT('ติดต่อ : ',' ',c.user_phone) as user_phone
            FROM tbsick_bed as a 
                        INNER JOIN tbsick_status as b ON a.sit_id = b.sit_id
                        INNER JOIN tbusers as c ON c.user_username = a.user_username
                        INNER JOIN tbprefix as d ON d.prefix_id = c.prefix_id ORDER BY a.sit_id DESC; ";
        
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
       

    }
?>