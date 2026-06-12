dependencies {
    implementation(project(":worldcup-api"))
    implementation("org.springframework.boot:spring-boot-starter-jdbc")
    implementation("org.postgresql:postgresql")
    testImplementation("org.junit.jupiter:junit-jupiter")
}
