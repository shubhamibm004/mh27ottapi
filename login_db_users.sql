-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: login_db
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `roles` varchar(255) NOT NULL DEFAULT 'User',
  `verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser','testuser@example.com','$2a$10$EIXb/9eeK8yWJztKn.GCa.KXWytvZhVjBIdXHdKlbj6jT1lb2yZzO','User',1),(2,'testuser@gmail.com',NULL,'$2a$10$EIXb/9eeK8yWJztKn.GCa.KXWytvZhVjBIdXHdKlbj6jT1lb2yZzO','User',0),(3,'shubham123','thakare607@gmail.com','$2a$10$4uRsGlIrDpfuhrINk/MuSezr3Tk11aZQKifB3hLxOvhV5OY2Pv43.','User',1),(4,'ajay','wanda@wan.da','$2a$10$kBLpIhttO/To2t6nRQxzDuu1THeLS5U5gGUA8kcYHWvZxyyNm1/qe','User',0),(5,'sajknsj','a@in.com','$2a$10$IvOInOB/GKVXl3SqZIm42.Jk2GTNyKuLlq0AGOuaogTUwVSVfeN76','User',0),(6,'oxidation','shubhamthakare@gmx.us','$2a$10$HFqoBMZ61DqTzMHxo7mFuOPqHG4nZzINe.3KN26uifaAhI6TYUOCm','User',0),(7,'oxidation','imailyoushubham@gmail.com','$2a$10$Yt39Wy6fuQ1FVW/LC5RLAe8TPzYuLf.QIPuzvlgHzx8ySEgj1HxYy','User',0),(8,'agile','wakanda@gmail.com','$2a$10$pnnuNHwxU0MXFcWkl5mXeeaugLU8fzGNnnNYzpb5ZboiYqwrv2xZq','User',0),(9,'oxidetitansjdsnkjdnsa','ajayatul@gmail.com','$2a$10$/OZQLWoHn5OZK9M1BLYrc.UJfo72qaELsdVoxuDB9SbW6Vs9Qs0IG','User',0),(10,'shubhamthakare','shubham.thakare@ibm.com','$2a$10$2n9xMKjwXv7WgqTeRWtdB.R8NxXo7oNEcI9MNVidz6YPjZTfa8dtW','User',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-13  3:30:27
