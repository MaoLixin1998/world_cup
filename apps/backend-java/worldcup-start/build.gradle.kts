plugins {
    id("org.springframework.boot")
}

dependencies {
    implementation(project(":worldcup-api"))
    implementation(project(":worldcup-service"))
    implementation(project(":worldcup-dal"))
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}
