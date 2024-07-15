package pck.mindspace;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import pck.mindspace.repos.SQLRepo;

@SpringBootApplication
public class MindspaceApplication implements CommandLineRunner{

	@Autowired
	SQLRepo sqlRepo;

	public static void main(String[] args) {
		SpringApplication.run(MindspaceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		sqlRepo.setupSQL();
	}

}
