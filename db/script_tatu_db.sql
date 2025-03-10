-- MySQL Workbench Synchronization
-- Generated: 2025-02-17 12:12
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: mike

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

/* ==============================
--    Creacion base de datos
=================================*/
CREATE SCHEMA IF NOT EXISTS `tatu_db` DEFAULT CHARACTER SET utf8 ;

/* ==============================
--      Tabla roles
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`roles` (
  `role_id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


/* ==============================
--      Tabla country
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`country` (
  `country_id` INT(11) NOT NULL AUTO_INCREMENT,
  `country_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`country_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

/* ==============================
--      Tabla cities
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`cities` (
  `city_id` INT(11) NOT NULL AUTO_INCREMENT,
  `country_id` INT(11) NOT NULL,
  `city_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`city_id`),
  CONSTRAINT `fk_city_country`
	FOREIGN KEY (`country_id`)
	REFERENCES `tatu_db`.`country` (`country_id`)
	ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

/* ==============================
--      Tabla tattoo_styles
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`tattoo_styles` (
  `tattoo_styles_id` INT(11) NOT NULL AUTO_INCREMENT,
  `tattoo_styles_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`tattoo_styles_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

/* ==============================
--      Tabla image
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`image` (
  `image_id` INT(11) NOT NULL AUTO_INCREMENT,
  `src` VARCHAR(255) NOT NULL,
  `content` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`image_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


/* ==============================
--         Tabla users
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_handle` VARCHAR(45) NOT NULL,
  `email_address` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `phonenumber` VARCHAR(15) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role_id` INT(11) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `birth_day` DATE NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `user_handle_UNIQUE` (`user_handle` ASC) VISIBLE,
  UNIQUE INDEX `email_address_UNIQUE` (`email_address` ASC) VISIBLE,
  INDEX `idx_email_address` (`email_address`),
  INDEX `idx_user_handle` (`user_handle`),
  CONSTRAINT `fk_users_roles`
    FOREIGN KEY (`role_id`)
    REFERENCES `tatu_db`.`roles` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


/* ==============================
--      Tabla profile
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`profile` (
  `user_id` INT(11) NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `gender` CHAR(1) NOT NULL,
  `country_id` INT(11) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `image_header` VARCHAR(255) NULL DEFAULT NULL,
  `bio` VARCHAR(200) NULL DEFAULT NULL,
  `follower_count` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `fk_profile_2_idx` (`country_id` ASC) VISIBLE,
  CONSTRAINT `fk_profile_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tatu_db`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_profile_2`
    FOREIGN KEY (`country_id`)
    REFERENCES `tatu_db`.`country` (`country_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

/* ==============================
--       Tabla followers
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`followers` (
  `follower_id` INT(11) NOT NULL,
  `following_id` INT(11) NOT NULL,
  PRIMARY KEY (`following_id`, `follower_id`),
  INDEX `fk_followers_1_idx1` (`follower_id` ASC) VISIBLE,
  CONSTRAINT `fk_check_followers`
    FOREIGN KEY (`following_id`)
    REFERENCES `tatu_db`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_followers_users`
    FOREIGN KEY (`follower_id`)
    REFERENCES `tatu_db`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


/* ==============================
--       Tabla posts
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`posts` (
  `post_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `post_text` TEXT NOT NULL,
  `num_likes` INT(11) NULL DEFAULT 0,
  `num_comments` INT(11) NULL DEFAULT 0,
  `num_repost` INT(11) NULL DEFAULT 0,
  `tattoo_styles_id` INT(11) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`),
  INDEX `fk_Posts_1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_Posts_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tatu_db`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Posts_tattoo_style`
	FOREIGN KEY (`tattoo_styles_id`)
	REFERENCES `tatu_db`.`tattoo_styles` (`tattoo_styles_id`)
	ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

/* ==============================
--      Tabla post_likes
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`post_likes` (
  `user_id` INT(11) NOT NULL,
  `post_id` INT(11) NOT NULL,
  PRIMARY KEY (`user_id`, `post_id`),
  INDEX `fk_post_likes_1_idx` (`post_id` ASC) VISIBLE,
  INDEX `idx_post_id_post_likes` (`post_id`),
  INDEX `idx_user_id_post_likes` (`user_id`),
  CONSTRAINT `fk_post_likes_1`
    FOREIGN KEY (`post_id`)
    REFERENCES `tatu_db`.`posts` (`post_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_post_likes_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `tatu_db`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


/* ==============================
--      Tabla messages
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`messages` (
  `messages_id` INT(11) NOT NULL AUTO_INCREMENT,
  `sender_id` INT(11) NOT NULL,
  `receiver_id` INT(11) NOT NULL,
  `content` TEXT NOT NULL,
  `sent_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`messages_id`),
  INDEX `fk_messages_1_idx` (`sender_id` ASC) VISIBLE,
  INDEX `fk_messages_2_idx` (`receiver_id` ASC) VISIBLE,
  INDEX `idx_sender_id_messages` (`sender_id`),
  INDEX `idx_receiver_id_messages` (`receiver_id`), 
  CONSTRAINT `fk_messages_1`
    FOREIGN KEY (`sender_id`)
    REFERENCES `tatu_db`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_messages_2`
    FOREIGN KEY (`receiver_id`)
    REFERENCES `tatu_db`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


/* ==============================
--      Tabla comments
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`comments` (
  `comment_id` INT(11) NOT NULL AUTO_INCREMENT,
  `post_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  INDEX `fk_comments_1_idx` (`post_id` ASC) VISIBLE,
  INDEX `fk_comments_2_idx` (`user_id` ASC) VISIBLE,
  INDEX `idx_post_id_comments` (`post_id`),
  CONSTRAINT `fk_comments_1`
    FOREIGN KEY (`post_id`)
    REFERENCES `tatu_db`.`posts` (`post_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comments_2`
    FOREIGN KEY (`user_id`)
    REFERENCES `tatu_db`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


/* ==============================
--      Tabla post_image
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`post_image` (
  `post_id` INT(11) NOT NULL,
  `image_id` INT(11) NOT NULL,
  PRIMARY KEY (`post_id`, `image_id`),
  INDEX `fk_post_image_1_idx` (`image_id` ASC) VISIBLE,
  CONSTRAINT `fk_post_image_1`
    FOREIGN KEY (`image_id`)
    REFERENCES `tatu_db`.`image` (`image_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_post_image_2`
    FOREIGN KEY (`post_id`)
    REFERENCES `tatu_db`.`posts` (`post_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


/* ==============================
--      Tabla appointments
=================================*/
CREATE TABLE IF NOT EXISTS `tatu_db`.`appointments` (
  `appointments_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `tattoo_artist_id` INT(11) NOT NULL,
  `date` DATETIME NOT NULL,
  `status` ENUM('pendiente', 'confirmada', 'cancelada') NOT NULL DEFAULT 'pendiente',
  PRIMARY KEY (`appointments_id`),
  INDEX `fk_appointments_1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_appointments_2_idx` (`tattoo_artist_id` ASC) VISIBLE,
  CONSTRAINT `fk_appointments_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `tatu_db`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_appointments_2`
    FOREIGN KEY (`tattoo_artist_id`)
    REFERENCES `tatu_db`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;




