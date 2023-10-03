CREATE TABLE `sys`.`users` (
  `users_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `username` VARCHAR(45) NOT NULL,
  `userpassword` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`users_id`));

CREATE TABLE `school`.`student_images` (
  `student_images_id` INT NOT NULL AUTO_INCREMENT,
  `student_image_url` VARCHAR(45) NOT NULL,
  `unit_number` INT NOT NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`student_images_id`),
  INDEX `users_id_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `users_id`
    FOREIGN KEY (`users_id`)
    REFERENCES `school`.`users` (`users_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


    CREATE TABLE `school`.`student_audios` (
  `student_audios_id` INT NOT NULL AUTO_INCREMENT,
  `student_audios_url` VARCHAR(100) NOT NULL,
  `unit_number` INT NOT NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`student_audios_id`),
  INDEX `users_id_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `users_id_2`
    FOREIGN KEY (`users_id`)
    REFERENCES `school`.`users` (`users_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
