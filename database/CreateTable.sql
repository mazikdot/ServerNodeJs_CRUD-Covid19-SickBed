/*------------------------tbsex-----------------------------*/
CREATE TABLE IF NOT EXISTS tbsex (
  sex_id int(1) PRIMARY KEY NOT NULL ,
  sex_name char(5) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) CHARACTER SET utf8 COLLATE utf8_general_ci;
/*-----------------------tbprefix-----------------------------*/
CREATE TABLE IF NOT EXISTS tbprefix (
  prefix_id int(1) PRIMARY KEY  NOT NULL,
  pre_th_name char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  pre_eng_name char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  pre_ab_th char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  pre_ab_eng char(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) CHARACTER SET utf8 COLLATE utf8_general_ci;
/*-----------------------tbroles-----------------------------*/
CREATE TABLE IF NOT EXISTS tbroles(
  roles_id int(1)  PRIMARY KEY NOT NULL,
  roles_name varchar(20)  CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
)  CHARACTER SET utf8 COLLATE utf8_general_ci;
/*-----------------------geographies-----------------------------*/
CREATE TABLE  IF NOT EXISTS geographies (
  geo_id  int(1)  PRIMARY KEY NOT NULL,
  name varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
)  CHARACTER SET utf8 COLLATE utf8_general_ci;
/*-----------------------provinces-----------------------------*/
CREATE TABLE IF NOT EXISTS provinces (
  province_id int(5) PRIMARY KEY NOT NULL,
  code varchar(2) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  name_th varchar(150)CHARACTER SET utf8 COLLATE utf8_general_ci  NOT NULL,
  name_en varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  geo_id int(1) NOT NULL,
   FOREIGN KEY (geo_id) REFERENCES geographies(geo_id) ON UPDATE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;
/*-------------------------amphures---------------*/
CREATE TABLE IF NOT EXISTS `amphures` (
  `amphure_id` int(5) PRIMARY KEY NOT NULL,
  `code` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name_th` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name_en` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `province_id` int(5) NOT NULL,
  FOREIGN KEY (province_id) REFERENCES provinces(province_id) ON UPDATE CASCADE
) CHARACTER SET utf8 COLLATE utf8_general_ci;
/*------------------------district----------*/
CREATE TABLE IF NOT EXISTS `districts` (
  `districts_id` varchar(6) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL PRIMARY KEY,
  `zip_code` int(11) NOT NULL,
  `name_th` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci  NOT NULL,
  `name_en` varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci  NOT NULL,
  `amphure_id` int(11) NOT NULL,
  FOREIGN KEY (amphure_id) REFERENCES amphures(amphure_id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='InnoDB free: 8192 kB';
/*----------------------tbuser-----------*/
CREATE TABLE IF NOT EXISTS tbusers(
	user_username varchar(70)  CHARACTER SET utf8 COLLATE utf8_general_ci  PRIMARY KEY NOT NULL ,
    user_passwords varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    user_firstname  varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    user_lastname  varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    user_email  varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    user_phone  char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    user_create timestamp NOT NULL,
    prefix_id int(1) NOT NULL,
    sex_id int(1) NOT NULL,
    province_id int(5) NOT NULL,
    roles_id int(1) NOT NULL,
    FOREIGN KEY (prefix_id) REFERENCES tbprefix(prefix_id) ON UPDATE CASCADE,
    FOREIGN KEY (sex_id) REFERENCES tbsex(sex_id) ON UPDATE CASCADE,
    FOREIGN KEY (province_id) REFERENCES provinces(province_id) ON UPDATE CASCADE,
    FOREIGN KEY (roles_id) REFERENCES tbroles(roles_id) ON UPDATE CASCADE
)CHARACTER SET utf8 COLLATE utf8_general_ci;
/*--------------------------tbadmin-------------------------------*/
CREATE TABLE IF NOT EXISTS tbadmin(
	add_username varchar(70) CHARACTER SET utf8 COLLATE utf8_general_ci PRIMARY KEY NOT NULL,
    add_password varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    add_firstname varchar(80)  CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    add_lastname varchar(80)  CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    add_idcardnumber char(13)  CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    add_phone char(10)  CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    roles_id int(1) NOT NULL,
    prefix_id int(1) NOT NULL,
    FOREIGN KEY (prefix_id) REFERENCES tbprefix(prefix_id) ON UPDATE CASCADE,
    FOREIGN KEY (roles_id) REFERENCES tbroles(roles_id) ON UPDATE CASCADE
)CHARACTER SET utf8 COLLATE utf8_general_ci;
/*-------------------------------tbsick_status---------------------------*/
CREATE TABLE IF NOT EXISTS tbsick_status(
sit_id int(1) PRIMARY KEY NOT NULL,
 sit_name varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
)CHARACTER SET utf8 COLLATE utf8_general_ci;

/*-----------------------tbsick_bed----------------*/
CREATE TABLE IF NOT EXISTS tbsick_bed(
	sick_id int(4) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    sick_name varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci  NOT NULL,
    sick_amount int(4) NOT NULL, 
    sick_note varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci  NULL,
    --sick_whogive varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci  NOT NULL,
    sit_id int(1) NOT NULL,
    user_username varchar(70) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
    FOREIGN KEY (sit_id) REFERENCES tbsick_status(sit_id) ON UPDATE CASCADE,
    FOREIGN KEY (user_username) REFERENCES tbusers(user_username) ON UPDATE CASCADE
)CHARACTER SET utf8 COLLATE utf8_general_ci;
/*-----------------------------tbgive_status------------------*/
CREATE TABLE IF NOT EXISTS tbgive_status(
	give_id int(4) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    give_name varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    give_note  varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
)CHARACTER SET utf8 COLLATE utf8_general_ci;
/*------------------------tbsix_want-------------------------*/
CREATE TABLE IF NOT EXISTS tbsick_want(
sickw_id int(4) AUTO_INCREMENT PRIMARY KEY NOT NULL,
sickw_name	varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
sickw_amount int(4) NOT NULL,
sickw_note	 varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci  NULL,
sickw_want_date	DATE NOT NULL,
sickw_date timestamp NOT NULL,
user_username varchar(70) CHARACTER SET utf8 COLLATE utf8_general_ci  NULL,
give_id	int(4) NOT NULL,
     FOREIGN KEY (give_id) REFERENCES tbgive_status(give_id) ON UPDATE CASCADE,
    FOREIGN KEY (user_username) REFERENCES tbusers(user_username) ON UPDATE CASCADE
)CHARACTER SET utf8 COLLATE utf8_general_ci;
/*------------------tbsummarize-----------------------*/
CREATE TABLE IF NOT EXISTS tbsick_want(
	sum_id int(4) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    bedwant_total int(4) NOT NULL,
    bedhave_total int(4) NOT NULL,
    sick_id int(4) NOT NULL,
    sickw_id int(4) NOT NULL,
    FOREIGN KEY (sick_id) REFERENCES tbsick_bed(sick_id) ON UPDATE CASCADE,
    FOREIGN KEY (sickw_id) REFERENCES tbsick_want(sickw_id) ON UPDATE CASCADE
)CHARACTER SET utf8 COLLATE utf8_general_ci;

ALTER TABLE tbusers ADD COLUMN amphure_id int(4) NOT NULL;
ALTER TABLE tbusers ADD COLUMN districts_id int(4) NOT NULL;
ALTER TABLE tbsick_bed ADD COLUMN date_add timestamp NOT NULL;
