CREATE TABLE astats (
  id varchar(50) CHARACTER SET utf8 NOT NULL PRIMARY KEY,
  name varchar(50) CHARACTER SET utf8 DEFAULT 0,
  role varchar(50) CHARACTER SET utf8 DEFAULT 0,
  hours_day int DEFAULT 0,
  balls int DEFAULT 0,
  otpusk varchar(50) CHARACTER SET utf8 DEFAULT 0
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;